// type BasicParamSetting<T extends number | bigint> = {
//     min: T;
//     max: T;
//     step?: T;
// };
// type RelationalParamSetting<T extends number | bigint> = {
//     relation: string;
//     ratioMin: T;
//     ratioMax: T;
// };

// type ParamSetting<T extends number | bigint> = T extends number
//     ? BasicParamSetting<number> | RelationalParamSetting<number>
//     : BasicParamSetting<bigint> | RelationalParamSetting<bigint>;
// type ParamSettings<T extends number | bigint> = Record<string, ParamSetting<T>>;
// type ParamGeneratorType<
//     ParamRecord extends ParamSettings<number | bigint>,
// > = {
//     [key in keyof ParamRecord]: ParamRecord[key] extends ParamSetting<number>
//         ? number
//         : bigint;
// };

// export function* paramGenerator<
//     const ParamRecord extends ParamSettings<number | bigint>,
// >(
//     params: Readonly<ParamRecord>,
// ): Generator<ParamGeneratorType<ParamRecord>> {
// }
