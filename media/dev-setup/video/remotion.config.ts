import { Config } from '@remotion/cli/config'

Config.setEntryPoint('src/index.ts')
Config.setVideoImageFormat('jpeg')
Config.setJpegQuality(92)
Config.setCodec('h264')
Config.setCrf(23)
Config.setPixelFormat('yuv420p')
Config.setAudioCodec('aac')
Config.setAudioBitrate('128k')
Config.setOverwriteOutput(true)
// Falls die Chrome Headless Shell nicht geladen werden kann, ein vorhandenes Chromium nutzen:
// BROWSER_EXECUTABLE=/Pfad/zu/chrome npx remotion render …
if (process.env.BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.BROWSER_EXECUTABLE)
}
