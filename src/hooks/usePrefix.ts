import useConfig from "./useConfig.ts"
import Path from "../utils/Path.ts"

export class Prefix extends Path {
  www: Path

  constructor(prefix: Path) {
    super(prefix)
    this.www = prefix.join("tea.xyz/var/www")
  }
}

export default function usePrefix() {
  const { teaPrefix } = useConfig()
  return new Prefix(teaPrefix)
}
