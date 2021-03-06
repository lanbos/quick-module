import { dirname, resolve, relative, basename } from "path";
import * as findup from "findup-sync";
import { existsSync } from "fs";

/**
 * @see {@link https://gist.github.com/youssman/745578062609e8acac9f#gistcomment-2304728}
 * @param {string} str 
 * @returns {string} 
 */
export function toDashed(str: string)
{
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}

/**
 * 将符合jsx约定的组件名变为符合快应用约定的组件名的中间步骤
 * @param {string} import_src 引入路径
 * @returns {string} 如: TodoItem -> todo_item
 */
export function toUnderscored(name: string)
{
    return name.replace(/[A-Z]/g, "_$&").toLowerCase().slice(1)
}


export function absolutePath(tsx_src: string, import_src: string)
{
    const tsx_dir = dirname(tsx_src);
    const target_relative_src = uxPath(tsx_src, import_src);
    const abs_src = resolve(tsx_dir, target_relative_src);
    return abs_src;
}

/**
 * 从import中的路径来判断要引入的模块是否为ux模块
 * @param {string} abs_src 引入文件的绝对路径
 */
export function isUxModule(abs_src: string)
{
    const tsx_path = abs_src.endsWith(".tsx") ? abs_src : `${abs_src}.tsx`;
    const ux_path = abs_src.endsWith(".ux") ? abs_src : `${abs_src}.ux`;
    return existsSync(tsx_path) || existsSync(ux_path);
}

/**
 * 从import中的路径来判断要引入的模块是否为样式文件
 * @param {string} import_src 引入路径
 */
export function isCssModule(import_src: string)
{
    const suffixes = [".css", ".scss", ".less"];
    for (const suffix of suffixes)
    {
        if (import_src.endsWith(suffix))
        {
            return true;
        }
    }
    return false;
}

/**
 * 将各个代码片段组合成一整段代码
 * @param {string[]} snippets 一连串代码片段
 */
export function combine(...snippets: Array<string>)
{
    return snippets.join("\r\n\r\n");
}

/**
 * 在快应用中，使用import标签引入ux文件，会在src属性填写被引入文件的路径
 * 此函数根据在tsx中import的路径，计算出要在src属性中填的路径
 * 方便之处在于，当使用npm复用组件时，避免写成src="../../node_modules/..."
 * @param file_src 
 * @param import_src 
 */
export function uxPath(file_src: string, import_src: string)
{
    if (import_src.startsWith("./") || import_src.startsWith("../"))
    {
        return import_src;
    }
    else
    {
        const from = dirname(file_src);
        const to = resolve(findup("node_modules", { cwd: file_src }), import_src);
        return relative(from, to).replace(/\\/g, "/");
    }
}

export function isDataModelKeyword(name: string)
{
    const keywords = new Set(["data", "props", "private", "protected", "public"]);
    return keywords.has(name);
}

export function removeDataModelKeyword(name: string)
{
    const keywords = ["this.data.", "this.props.", "this.private.", "this.protected.", "this.public."];
    for (const keyword of keywords)
    {
        name = name.replace(keyword, "");
    }
    return name;
}