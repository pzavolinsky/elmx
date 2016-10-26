interface StepArgs {
  get: <T>(key:string) => T
  set: <T>(key:string, value:T) => T
  equal: <T>(actual:T, expected:T, msg?:string) => void
}

export interface Register {
  (reg:(re:RegExp, fn:any) => void, args:StepArgs) : void
}
