import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import * as latexParser from '@unified-latex/unified-latex-util-parse'
import {convertToHtml} from '@unified-latex/unified-latex-to-hast'

window.unified = unified
window.remarkParse = remarkParse
window.remarkRehype = remarkRehype
window.rehypeStringify = rehypeStringify
window.latexParser = latexParser
window.convertToHtml = convertToHtml
