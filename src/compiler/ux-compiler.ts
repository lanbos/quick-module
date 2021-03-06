import { generateUxRefs, generateJsRef, generateStyleRef } from "../generator/reference-generator";
import { generateVdom } from "../generator/vdom-generator";
import { generateTemplate } from "../generator/template-generator";

import { ModuleInfo, ImportInfo } from "./js-compiler";
import { combine } from "../utility/utility";
import { preprocess } from "../preprocessor/preprocessor";

/**
 * 从jsx代码，翻译得到ux文件中的代码
 */
export function compileToUx(jsx_code: string, tsx_src: string, import_info: ImportInfo)
{
    //
    const preprocessed = preprocess(jsx_code);

    //
    const template_snippet = compileTemplate({
        preprocessed, ux_imported: import_info.ux
    });

    const script_snippet = generateJsRef(tsx_src);
    const style_snippet = generateStyleRef(import_info.style);

    return combine(template_snippet, script_snippet, style_snippet);
}

/**
 * 从预处理后的jsx代码，翻译得到ux文件中template相关的代码
 * @param {string} preprocessed 预处理后的jsx代码
 */

export function compileTemplate({ preprocessed, ux_imported}: { preprocessed: string, ux_imported: Array<ModuleInfo>, prettify?: boolean })
{
    const ux_refs = generateUxRefs(ux_imported);
    const vdom = generateVdom(preprocessed);
    const template = generateTemplate(vdom);
    return combine(ux_refs, template);
}