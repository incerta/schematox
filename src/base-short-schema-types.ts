export type BS_String_Req = 'string'
export type BS_String_Opt = 'string?'

export type BS_Number_Req = 'number'
export type BS_Number_Opt = 'number?'

export type BS_Boolean_Req = 'boolean'
export type BS_Boolean_Opt = 'boolean?'

export type BS_Buffer_Req = 'buffer'
export type BS_Buffer_Opt = 'buffer?'

export type BS_Schema_Req =
  | BS_String_Req
  | BS_Number_Req
  | BS_Boolean_Req
  | BS_Buffer_Req

export type BS_Schema_Opt =
  | BS_String_Opt
  | BS_Number_Opt
  | BS_Boolean_Opt
  | BS_Buffer_Opt

export type BS_Schema = BS_Schema_Req | BS_Schema_Opt

export type Con_BS_Schema_Req_SubjT<T extends BS_Schema_Req> =
  T extends BS_String_Req
    ? string
    : T extends BS_Number_Req
      ? number
      : T extends BS_Boolean_Req
        ? boolean
        : T extends BS_Buffer_Req
          ? Buffer
          : never

export type Con_BS_Schema_Opt_SubjT<T extends BS_Schema_Opt> =
  T extends BS_String_Opt
    ? string | undefined
    : T extends BS_Number_Opt
      ? number | undefined
      : T extends BS_Boolean_Opt
        ? boolean | undefined
        : T extends BS_Buffer_Opt
          ? Buffer | undefined
          : never

export type Con_BS_Schema_SubjT<T extends BS_Schema> = T extends BS_Schema_Req
  ? Con_BS_Schema_Req_SubjT<T>
  : T extends BS_Schema_Opt
    ? Con_BS_Schema_Opt_SubjT<T>
    : never
