import { exec, execSync } from "child_process";
import { join, resolve } from "path";
import fse from 'fs-extra'

const MACOS_PATH = join(__dirname, '../macos')

const runCmd = async (cmd: string, cwd?: string) => {
  const { stdout, stderr, stdin } = exec(cmd,
    {
      cwd: cwd,
    })

  return new Promise(resolve => {
    stdin?.pipe(process.stdin)
    stderr?.pipe(process.stderr)

    if (stdout) {
      stdout.pipe(process.stdout)
      stdout.on('end', () => {
        resolve(true)
      })
      stdout.on('error', () => {
        resolve(false)
      })
    }
  })
}

const main = async () => {
  
  await runCmd(
    `xcodebuild \\
      -scheme "Vincu (macOS)" \\
      -configuration release \\
      -archivePath ./build/vincu \\
      archive`, MACOS_PATH)

  await runCmd(
    `xcodebuild \\
      -exportArchive \\
      -archivePath ./build/vincu.xcarchive \\
      -exportPath ./build \\
      -exportOptionsPlist ./ExportOptions.plist \\
      -allowProvisioningUpdates`, MACOS_PATH)

  console.log('> Archive Vincu.app done\n')

  const buildPath = join(MACOS_PATH, './build')

  const appPath = join(buildPath, './Vincu.app')

  const outDir = join(__dirname, '../')

  const outAppPath = join(outDir, './Vincu.app')

  fse.copySync(appPath, outAppPath)

  try {
    await runCmd("pnpm create-dmg Vincu.app macos/build --overwrite", outDir)
  } catch (e) {
    console.log('Error')
  }

  fse.removeSync(outAppPath)
}

main()

