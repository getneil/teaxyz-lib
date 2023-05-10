import { SupportedPlatform, SupportedArchitecture } from "../types.ts"
import * as process from "node:process"

interface HostReturnValue {
  platform: SupportedPlatform
  arch: SupportedArchitecture
  target: string
  build_ids: [SupportedPlatform, SupportedArchitecture]
}

export default function host(): HostReturnValue {
  const arch = (() => {
    switch (process.arch) {
      case "x64":
        return "x86-64"
      case "arm64":
        return "aarch64"
      default:
        throw new Error(`unsupported-arch: ${process.arch}`)
    }
  })()

  const platform = (() => {
    switch (process.platform) {
      case "darwin":
      case "linux":
      case "win32":
      case "freebsd":
      case "netbsd":
      case "aix":
      case "sunos":
        return process.platform as SupportedPlatform
      default:
        console.warn("assuming linux mode for:", process.platform)
        return "linux"
    }
  })()

  const target = `${platform}-${arch}`

  return {
    platform,
    arch,
    target,
    build_ids: [platform, arch],
  }
}
