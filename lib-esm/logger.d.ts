export default class Logger {
    private _level;
    private LEVELS;
    level: string;
    debug(stmt: any): void;
    info(stmt: any): void;
    warn(stmt: any): void;
    error(stmt: any): void;
}
