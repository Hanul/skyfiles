"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const FS = __importStar(require("fs"));
const Path = __importStar(require("path"));
class SkyFiles {
    async checkFileExists(path) {
        if (path === "./") {
            return true;
        }
        else {
            return new Promise((resolve) => {
                FS.access(path, (error) => {
                    if (error !== null) {
                        resolve(false);
                    }
                    else {
                        FS.readdir(Path.dirname(path), (error2, names) => {
                            if (error2 !== null) {
                                resolve(false);
                            }
                            else {
                                resolve(names.includes(Path.basename(path)));
                            }
                        });
                    }
                });
            });
        }
    }
    async readBuffer(path) {
        if (await this.checkFileExists(path) !== true) {
            throw new Error(`${path} Not Exists`);
        }
        else {
            return new Promise((resolve, reject) => {
                FS.stat(path, (error, stat) => {
                    if (error !== null) {
                        reject(error);
                    }
                    else if (stat.isDirectory() === true) {
                        reject(new Error(`${path} Is Folder`));
                    }
                    else {
                        FS.readFile(path, (error2, buffer) => {
                            if (error2 !== null) {
                                reject(error2);
                            }
                            else {
                                resolve(buffer);
                            }
                        });
                    }
                });
            });
        }
    }
    async readText(path) {
        return (await this.readBuffer(path)).toString();
    }
    async getFileInfo(path) {
        if (await this.checkFileExists(path) !== true) {
            throw new Error(`${path} Not Exists`);
        }
        else {
            return new Promise((resolve, reject) => {
                FS.stat(path, (error, stat) => {
                    if (error !== null) {
                        reject(error);
                    }
                    else {
                        resolve({
                            size: stat.isDirectory() === true ? 0 : stat.size,
                            createTime: stat.birthtime,
                            lastUpdateTime: stat.mtime,
                        });
                    }
                });
            });
        }
    }
    async deleteFile(path) {
        if (await this.checkFileExists(path) === true) {
            return new Promise((resolve, reject) => {
                FS.unlink(path, (error) => {
                    if (error !== null) {
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
    }
    async createFolder(path) {
        if (await this.checkFileExists(path) !== true) {
            const folderPath = Path.dirname(path);
            if (folderPath !== path && folderPath + "/" !== path) {
                if (folderPath === "." || await this.checkFileExists(folderPath) === true) {
                    return new Promise((resolve, reject) => {
                        FS.mkdir(path, (error) => {
                            if (error !== null) {
                                reject(error);
                            }
                            else {
                                resolve();
                            }
                        });
                    });
                }
                else {
                    await this.createFolder(folderPath);
                    return this.createFolder(path);
                }
            }
        }
    }
}
exports.default = new SkyFiles();
//# sourceMappingURL=SkyFiles.js.map