/* =========================================================================
 * C 结构速查 · 内容数据源
 * -------------------------------------------------------------------------
 * 这是全站唯一需要人工编辑的文件。新增 / 修改条目只改这里，
 * 不需要碰 index.html、style.css 或 app.js。
 *
 * 为什么是 .js 而不是 .json：
 *   双击 index.html 时浏览器地址是 file://，用 fetch('data.json')
 *   会被同源策略拦住。写成普通脚本赋给全局变量即可离线直接打开。
 *
 * 顶层还导出 sources：来源清单（id / name / kind / verified / url / note）。
 *   verified 记录证据等级：fetched-200 = 本环境实际抓到正文；
 *   其余等级表示「仅官方地址 / 正文被截断 / 搜索结果片段 / 索引页链接」，
 *   未逐条核对标准原文。页面会把这两类来源用不同标记显示，请勿混为一谈。
 *
 * 条目字段（* 为必填）：
 *   id*        唯一英文短名，用连字符；同时用作网址里的 #锚点
 *   name*      显示名称
 *   category*  必须等于下面 categories 里的某个 name
 *   aliases*   中英别名数组，供搜索命中；第一版不含拼音
 *   summary*   一句话说明
 *   syntax*    语法模板
 *   code*      可直接编译的最小完整程序（模板字符串内 C 的反斜杠写两遍）
 *   level*     教学复杂度分档：basic（一眼懂，不加注释）/ guided（1~3 条行内注释）
 *              / detailed（含长难句：(1)(2) 编号注释 + 下方逐句解读）
 *   walkthrough 仅 detailed 档需要：[{ n: 1, title: '...', text: '...' }]
 *              编号必须与代码里的 (n) 一一对应，页面渲染成「难句逐句解读」模块
 *   extra      可选：补充说明数组，放标准依据、取值范围、对比细节等中性知识；
 *              用 `反引号` 包裹代码词，渲染时会转成 <code>；没有就整块隐藏
 *   pitfalls*  易错点数组，至少 2 条（只放「坑」，不放中性知识）
 *   references* 参考来源数组：[{ source: '来源 id', topic: '主题', section: '条款号' }]
 *              section 可选，**只在核对到原文时才写**，不要编造条款号
 *   related*   相关条目的 id 数组，可为空数组
 * ========================================================================= */
(function (global) {
  'use strict';

  var categories = [
    { id: 'structure',  name: '程序结构',    desc: '一个 C 程序从哪开始、由哪些部分组成' },
    { id: 'types',      name: '数据类型',    desc: '内置类型、占用空间与类型别名' },
    { id: 'variables',  name: '变量与常量',  desc: '声明、定义、限定符与可见范围' },
    { id: 'operators',  name: '运算符',      desc: '运算写法、优先级与位运算' },
    { id: 'control',    name: '控制结构',    desc: '条件分支与循环' },
    { id: 'functions',  name: '函数',        desc: '定义、原型、参数与调用' },
    { id: 'arrays',     name: '数组与字符串', desc: '数组、字符数组与字符串结束符' },
    { id: 'pointers',   name: '指针',        desc: '地址、解引用与指针运算' },
    { id: 'composite',  name: '复合类型',    desc: '结构体、联合体与成员访问' },
    { id: 'memory',     name: '内存管理',    desc: '堆分配、释放与常见错误' },
    { id: 'fileio',     name: '文件 I/O',    desc: '打开模式与格式化读写' },
    { id: 'preprocess', name: '预处理与宏',  desc: '宏定义、包含与条件编译' }
  ];

  /* 参考来源清单：由联网核对整理，verified 表示证据等级。
   * 条目里的 references 用 source id 引用这里的条目。 */
  var sources = [
    {
      id: "n1570", name: "ISO/IEC 9899:2011 委员会草案 N1570（WG14 官方）",
      kind: "标准草案", verified: "pdf-unavailable",
      url: "https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf",
      note: "官方 PDF 地址；本环境抓取工具不支持 PDF 二进制，未直接读到正文。下面标了条款号的条目，其条款文字是通过公开引用原文与 C99 勘误对照核对的；未标条款号的只作主题级依据。"
    },
    {
      id: "n1570-html", name: "C11 N1570 HTML 镜像（port70）",
      kind: "标准草案镜像", verified: "http-200-truncated",
      url: "https://port70.net/~nsz/c/c11/n1570.html",
      note: "返回 HTTP 200，但整页过大被抓取工具截断，未逐条读到正文。"
    },
    {
      id: "c99-cor2", name: "ISO/IEC 9899:1999 技术勘误 2（WG14 官方）",
      kind: "标准勘误", verified: "search-result-text",
      url: "https://www.open-std.org/jtc1/sc22/wg14/www/docs/9899-1999_cor_2-2004.pdf",
      note: "搜索结果返回了正文片段，含 §6.7.2.1 位域宽度与柔性数组成员段落的修订文字。"
    },
    {
      id: "n2159", name: "WG14 N2159：柔性数组成员可能取未指定值",
      kind: "缺陷报告", verified: "search-result-text",
      url: "https://www.open-std.org/JTC1/SC22/WG14/www/docs/n2159.pdf",
      note: "搜索结果返回正文片段，引用了 C11 §6.7.2.1 与 §6.2.6.1p6（结构体填充字节取值未指定）。"
    },
    {
      id: "cert-c", name: "SEI CERT C 编码标准（规则总目录）",
      kind: "安全编码规则", verified: "linked-from-fetched",
      url: "https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/",
      note: "MEM30-C 页面抓取成功，其导航中含本总目录。下面的规则编号来自该标准及规则清单。"
    },
    {
      id: "cert-mem30", name: "SEI CERT C · MEM30-C 不要访问已释放内存",
      kind: "安全编码规则", verified: "fetched-200",
      url: "https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/memory-management-mem/mem30-c/",
      note: "实际抓取并读到全文：释放后指针值不确定、读写已释放内存是未定义行为；参考文献列出 ISO/IEC 9899:2011 §7.22.3。"
    },
    {
      id: "cert-int", name: "SEI CERT C · 02 Integers (INT) 规则清单",
      kind: "安全编码规则", verified: "search-result-text",
      url: "https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=87162492",
      note: "直接抓取超时；规则编号（INT31-C / INT32-C / INT07-C 等）来自搜索结果返回的该页规则清单。"
    },
    {
      id: "cert-list", name: "MathWorks：CERT C 规则与建议清单",
      kind: "规则索引", verified: "search-result-text",
      url: "https://au.mathworks.com/help/bugfinder/cert-c-rules-and-recommendations.html?lang=en",
      note: "搜索结果返回了 PRE / DCL / EXP / INT / MEM 等规则的编号清单，用于交叉核对规则号。"
    },
    {
      id: "gcc-stmt-expr", name: "GCC 文档 §6.12.1 语句表达式",
      kind: "编译器文档（扩展）", verified: "fetched-200",
      url: "https://gcc.gnu.org/onlinedocs/gcc/Statement-Exprs.html",
      note: "实际抓取并读到全文；明确这是 GNU C 扩展，不是 ISO C。含「让宏只求值一次」的写法与阴影问题。"
    },
    {
      id: "gcc-typeof", name: "GCC 文档 §6.12.5 typeof",
      kind: "编译器文档（扩展）", verified: "fetched-200",
      url: "https://gcc.gnu.org/onlinedocs/gcc/Typeof.html",
      note: "实际抓取并读到全文；含 typeof / __typeof__ 与 __auto_type，并指明 C23 的 typeof_unqual。"
    },
    {
      id: "gcc-zero-length", name: "GCC 文档 §6.2.2 零长数组",
      kind: "编译器文档（扩展）", verified: "fetched-200",
      url: "https://gcc.gnu.org/onlinedocs/gcc/Zero-Length.html",
      note: "实际抓取并读到全文；明确零长数组是 GNU 扩展，并逐条对比 ISO C99 柔性数组成员的差别。"
    },
    {
      id: "cppref-generic", name: "cppreference（中文镜像）· 泛型选择 _Generic",
      kind: "语言参考", verified: "fetched-200",
      url: "https://cppreference.tw/c/language/generic",
      note: "实际抓取并读到全文；引用 C11 §6.5.1.1（p78-79）、C17 §6.5.1.1（p56-57），并列出 DR 481 左值转换的追溯修正。"
    }
  ];

  var entries = [

    /* ------------------------------ 程序结构 ------------------------------ */
    {
      id: 'main-function',
      name: 'main 函数',
      category: '程序结构',
      aliases: ['主函数', '程序入口', '入口', 'main', 'entry', 'entry point'],
      summary: '程序执行的起点；一个 C 程序必须有且只有一个 main。',
      syntax: 'int main(void) { /* 语句 */ return 0; }\nint main(int argc, char *argv[]) { /* ... */ }',
      code: `#include <stdio.h>

int main(void) {
    printf("hello, C\\n");
    return 0;
}`,
      level: 'basic',
      pitfalls: [
        '标准形式是 int main(void)，不要写 void main（不是标准写法）。',
        '返回 0 表示成功；非 0 通常表示出错，由操作系统接收。',
        'main 之外的函数不会自动执行，必须被 main 直接或间接调用。'
      ],
      references: [
        { source: "n1570", topic: "程序启动与 main 函数" }
      ],
      related: ['include-header', 'function-prototype']
    },
    {
      id: 'include-header',
      name: '#include 与头文件',
      category: '程序结构',
      aliases: ['头文件', '包含', '引入', 'include', 'header', '预处理指令', 'stdio.h'],
      summary: '把头文件内容原样插入当前位置，用来拿到库函数的声明。',
      syntax: '#include <系统头文件>\n#include "自己的头文件.h"',
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char s[] = "abc";
    printf("%zu\\n", strlen(s));
    return 0;
}`,
      level: 'basic',
      pitfalls: [
        '尖括号查系统目录，双引号先查当前目录；自己的头文件用双引号。',
        '#include 只是文本替换，不会自动链接库；数学函数还需额外链接 -lm。',
        '头文件末尾不要放函数定义（多人包含会造成重复定义），只放声明。'
      ],
      references: [
        { source: "n1570", topic: "预处理指令 #include" },
        { source: "n1570", topic: "头文件保护写法" }
      ],
      related: ['define-macro', 'function-prototype']
    },

    /* ------------------------------ 数据类型 ------------------------------ */
    {
      id: 'basic-types',
      name: '基本数据类型',
      category: '数据类型',
      aliases: ['类型', '基本类型', 'int', 'char', 'float', 'double', 'short', 'long', 'void', 'types', 'data type'],
      summary: 'C 的内置类型：字符、整数、浮点，以及表示"无类型"的 void。',
      syntax: 'char  short  int  long  long long\nfloat  double  long double\nvoid\nsigned / unsigned（修饰整数类型）',
      code: `#include <stdio.h>

int main(void) {
    int a = 42;
    unsigned int b = 42u;   /* u 后缀说明这是无符号字面量 */
    double c = 3.14;        /* 不带后缀的小数字面量默认是 double */
    char d = 'A';
    printf("%d %u %.2f %c\\n", a, b, c, d);
    return 0;
}`,
      extra: [
        '四大类：字符（`char`）、整数（`short` / `int` / `long` / `long long` + `signed` / `unsigned`）、浮点（`float` / `double` / `long double`）、以及 `void`。',
        '`signed` / `unsigned` 只能修饰整数类型；单独写 `signed` 等价于 `signed int`，单独写 `unsigned` 等价于 `unsigned int`。',
        '想看细分的取值范围、精度差异与转换规则，见本分类下的「整数类型宽度对比」「float 与 double 的区别」等条目。',
        '标准依据：C11 §6.2.5（类型）、§6.7.2（类型说明符）。'
      ],
      level: 'guided',
      pitfalls: [
        'int / short / long 的字节数由平台决定，只有最小范围有保证；需要精确宽度用 <stdint.h> 的 int32_t。',
        'char 是否有符号由实现决定，参与数值运算时别默认它是 signed。',
        'float 与 double 精度不同，printf 里 %f 对应 double，别用 %d 打印浮点数。'
      ],
      references: [
        { source: "n1570", topic: "基本类型与类型说明符" }
      ],
      related: ['integer-types-compared', 'signed-unsigned', 'float-double', 'sizeof-operator', 'typedef-alias']
    },
    {
      id: 'typedef-alias',
      name: 'typedef 类型别名',
      category: '数据类型',
      aliases: ['类型别名', '别名', '自定义类型', 'typedef', 'type alias', '类型定义'],
      summary: '给已有类型起一个新名字；不创建新类型，只让声明更短更清楚。',
      syntax: 'typedef 原类型 新名字;\ntypedef struct { int x; int y; } Point;',
      code: `#include <stdio.h>

typedef unsigned int uint;
typedef struct { int x; int y; } Point;

int main(void) {
    uint n = 5u;
    Point p = {1, 2};
    printf("%u %d\\n", n, p.x + p.y);
    return 0;
}`,
      level: 'basic',
      pitfalls: [
        'typedef 只取别名，不分配空间、也不产生新类型；不能用它"定义变量"。',
        'typedef 与 #define 不同：前者由编译器处理、有类型检查，后者只是文本替换。',
        '指针别名要小心：typedef char *Str; 之后 const Str p 是"指针常量"，不是"指向常量的指针"。'
      ],
      references: [
        { source: "n1570", topic: "typedef 声明" },
        { source: "n1570", topic: "<stdint.h> 的类型别名实现" }
      ],
      related: ['basic-types', 'struct-type']
    },
    {
      id: 'sizeof-operator',
      name: 'sizeof 运算符',
      category: '数据类型',
      aliases: ['字节数', '大小', '长度', 'sizeof', 'size of', '占用空间', 'size'],
      summary: '求类型或表达式所占的字节数，结果是 size_t 类型的编译期常量。',
      syntax: 'sizeof(类型)\nsizeof 表达式\nsizeof(数组) / sizeof(数组[0])   /* 数组元素个数 */',
      code: `#include <stdio.h>

int main(void) {
    int a[10];
    printf("int: %zu\\n", sizeof(int));
    /* 用整个数组的大小除以一个元素的大小，得到元素个数；
       这样写即使改了数组类型也不用改分母 */
    printf("元素个数: %zu\\n", sizeof(a) / sizeof(a[0]));
    return 0;
}`,
      extra: [
        '返回类型是 `size_t`（`<stddef.h>` 定义的无符号整数类型），所以打印格式是 `%zu`。',
        '对类型/变量，`sizeof` 在**编译期**就能确定（变长数组 VLA 例外，那时在运行期求值）。',
        '`sizeof(char) == 1` 是标准保证；但一个字节未必是 8 位，用 `<limits.h>` 的 `CHAR_BIT` 查。',
        '结构体大小可能因**内存对齐填充**大于成员之和，别手工累加猜测。'
      ],
      level: 'guided',
      pitfalls: [
        '打印 sizeof 结果用 %zu（size_t），不是 %d。',
        '数组一旦作为函数参数传入就退化为指针，此时 sizeof 得到的是指针大小，不是数组大小。',
        'sizeof 是运算符不是函数；sizeof 表达式里的表达式不会被求值。'
      ],
      references: [
        { source: "n1570", topic: "sizeof 运算符" },
        { source: "cert-int", topic: "用 size_t 表示对象大小", section: "INT01-C" }
      ],
      related: ['basic-types', 'array-1d', 'array-vs-pointer', 'integer-types-compared']
    },

    /* --- 以下为「细粒度」条目：把容易混的相近概念拆开单独成条 --- */
    {
      id: 'integer-types-compared',
      name: '整数类型宽度对比',
      category: '数据类型',
      aliases: ['整数宽度', '取值范围', 'short', 'int', 'long', 'long long', '字节数', '范围', 'integer range', 'width', 'limits.h'],
      summary: 'short / int / long / long long 只保证最小范围与相对次序，实际字节数由平台决定。',
      syntax: 'short  ≤ int ≤ long ≤ long long   （保证的「不小于」关系）\n#include <limits.h>   /* INT_MIN / INT_MAX / LONG_MAX ... */\n#include <stdint.h>   /* int8_t / int32_t / uint64_t，宽度精确 */',
      code: `#include <stdio.h>
#include <limits.h>

int main(void) {
    /* (1) 同一段代码在 Windows 与 Linux 上，long 那一项可能不同 */
    printf("short %zuB int %zuB long %zuB\\n",
           sizeof(short), sizeof(int), sizeof(long));
    /* (2) 用 limits.h 的宏问编译器，而不是自己背范围 */
    printf("INT_MIN=%d INT_MAX=%d\\n", INT_MIN, INT_MAX);
    return 0;
}`,
      extra: [
        '标准只保证：`short` ≥ 16 位、`int` ≥ 16 位、`long` ≥ 32 位、`long long` ≥ 64 位，以及 `short ≤ int ≤ long ≤ long long`。',
        '常见平台（LP64：Linux/macOS 64 位）：`short` 2B / `int` 4B / `long` 8B / `long long` 8B。',
        'Windows 64 位是 LLP64：`long` 仍是 4B，只有 `long long` 和指针是 8B —— 这是同一段代码在两边结果不同的常见原因。',
        '要精确宽度就用 `<stdint.h>` 的 `int32_t`、`uint64_t`；要打印它们用 `<inttypes.h>` 的 `PRIu64` 等宏。',
        '标准依据：C11 §5.2.4.2.1（整数类型的大小限制）、§6.2.5（类型）。'
      ],
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "为什么用 sizeof 而不是写死字节数",
          text: "C 标准只保证 short ≤ int ≤ long ≤ long long 的相对大小，不规定具体字节数。常见的 64 位 Linux/macOS（LP64）里 long 是 8 字节，而 64 位 Windows（LLP64）里 long 仍是 4 字节。所以把宽度打印出来，比在代码里假设「int 一定是 4」可靠；涉及文件格式或网络协议时，应改用 <stdint.h> 的 int32_t 这类固定宽度类型。" },
        { n: 2, title: "INT_MIN / INT_MAX 从哪来",
          text: "这两个宏定义在 <limits.h> 里，值是「当前平台当前编译器」给 int 规定的最小/最大可表示值。用它们就不需要记住 2147483647 这种数字，移植到别的平台也不会失准。无符号对应 UINT_MAX，long 对应 LONG_MIN / LONG_MAX。" },
      ],
      pitfalls: [
        '别在代码里硬编码 `int` 是 4 字节；用 `sizeof` 或固定宽度类型。',
        '`long` 在 Windows 与 Linux 上宽度不同，涉及文件格式、网络协议时尤其危险。',
        '有符号整数溢出是未定义行为，不能用"溢出了会回绕"来写逻辑（无符号才保证回绕）。'
      ],
      references: [
        { source: "n1570", topic: "整数类型与 <limits.h> 取值范围" },
        { source: "cert-int", topic: "整数精度与转换", section: "INT31-C / INT35-C" }
      ],
      related: ['basic-types', 'signed-unsigned', 'float-double', 'sizeof-operator']
    },
    {
      id: 'signed-unsigned',
      name: 'signed 与 unsigned 的区别',
      category: '数据类型',
      aliases: ['有符号', '无符号', '符号位', '回绕', '溢出', 'unsigned', 'signed', '范围', '混用'],
      summary: '同一宽度下，unsigned 把符号位算进数值，范围变成 0 ~ 2^n−1，且溢出保证回绕。',
      syntax: 'signed int a;      /* 可省略 signed，int 默认有符号 */\nunsigned int b;    /* 0 ~ UINT_MAX */\nunsigned u = 5u;   /* 字面量后缀 u */',
      code: `#include <stdio.h>
#include <limits.h>

int main(void) {
    unsigned int u = 0u;
    /* (1) 无符号减到 0 以下会按 2^n 取模，回绕到最大值 */
    u = u - 1u;
    printf("UINT_MAX=%u  u=%u\\n", UINT_MAX, u);
    /* (2) 混用有符号与无符号时，-1 会先被转成很大的无符号数 */
    printf("-1 < 1u ? %d\\n", -1 < 1u);
    return 0;
}`,
      extra: [
        'n 位有符号（补码常见实现）范围约 `−2^(n−1) ~ 2^(n−1)−1`；n 位无符号是 `0 ~ 2^n−1`。',
        '无符号运算按 `2^n` 取模，**回绕是标准保证的**；有符号溢出则是未定义行为。',
        '混合运算时若两边"等级"相同且有/无符号混用，有符号一侧会被转换成无符号（C11 §6.3.1.8）。',
        '所以 `-1 < 1u` 通常为 **0（假）**：`-1` 先被转成很大的 `UINT_MAX`。',
        '`char` 的符号性是例外：`char`、`signed char`、`unsigned char` 是三种不同类型（见下一条）。'
      ],
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "unsigned 为什么会「绕回去」",
          text: "无符号运算是标准保证的模 2^n 运算（n 是该类型的位数）。0u - 1u 不是得到 -1，而是得到 UINT_MAX。这是定义良好的行为，和有符号整数溢出（未定义行为）完全不同。也正因为如此，用无符号变量倒着写 for (unsigned i = n-1; i >= 0; i--) 会变成死循环：i >= 0 永远为真。" },
        { n: 2, title: "-1 < 1u 为什么是假",
          text: "C 的「寻常算术转换」规定：当两边类型等级相同、一个有符号一个无符号时，有符号一侧会被转换成无符号。于是 -1 变成 UINT_MAX（一个非常大的正数），比较变成 UINT_MAX < 1u，结果为 0（假）。这不是编译器的 bug，而是规则本身；看到有符号和 size_t、strlen 返回值、数组下标混在一起比较时，都要先想一下这条转换。" },
      ],
      pitfalls: [
        '`for (unsigned i = n - 1; i >= 0; i--)` 是死循环：`i >= 0` 永远成立。倒序遍历建议用有符号类型。',
        '数组下标、`sizeof` 结果、`strlen` 返回值多为无符号，和有符号的 `-1` 比较前先想清楚转换规则。',
        '`printf` 里 `%d` 对应 `int`、`%u` 对应 `unsigned int`，格式不匹配是未定义行为。'
      ],
      references: [
        { source: "n1570", topic: "寻常算术转换与无符号回绕" },
        { source: "cert-int", topic: "整数转换与溢出", section: "INT31-C / INT32-C / INT30-C" }
      ],
      related: ['integer-types-compared', 'char-variants', 'implicit-conversion', 'basic-types']
    },
    {
      id: 'float-double',
      name: 'float 与 double 的区别',
      category: '数据类型',
      aliases: ['单精度', '双精度', '浮点', '精度', '小数', 'float', 'double', 'long double', 'f 后缀', '有效数字'],
      summary: 'double 精度约为 float 的两倍；不带后缀的小数字面量默认是 double。',
      syntax: 'float  f = 3.14f;    /* 后缀 f 才是 float */\ndouble d = 3.14;     /* 默认 double */\nlong double ld = 3.14L;',
      code: `#include <stdio.h>

int main(void) {
    float f = 0.1f;      /* (1) 后缀 f 让这个字面量本身就是 float */
    double d = 0.1;      /* 不带后缀的小数字面量默认是 double */
    printf("float=%.9f double=%.17f\\n", f, d);
    /* (2) 十进制小数在二进制里往往存不精确，别用 == 判等 */
    printf("0.1+0.2==0.3 ? %d\\n", 0.1 + 0.2 == 0.3);
    return 0;
}`,
      extra: [
        '典型实现（IEEE 754）：`float` 32 位，约 **7 位**十进制有效数字；`double` 64 位，约 **15~16 位**。',
        '`printf` 里 `%f` 接收的是 `double`：`float` 实参会因默认参数提升自动转成 `double`，所以不必写 `%lf`（`scanf` 才需要区分）。',
        '标准只规定 `float ≤ double ≤ long double` 的精度次序，不强制 IEEE 754；精确布局查 `<float.h>` 的 `FLT_MANT_DIG` / `DBL_MANT_DIG`。',
        '`0.1`、`0.2` 这类十进制小数在二进制里无法精确表示，误差是表示问题，不是"算错了"。',
        '标准依据：C11 §6.4.4.2（浮点常量）、§5.2.4.2.2（浮点特性）。'
      ],
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "0.1f 与 0.1 不是一回事",
          text: "3.14 这样的字面量默认是 double；写 float f = 0.1; 会发生一次 double → float 的隐式收窄。加上 f 后缀后字面量本身就是 float，避免多一次转换。同理 long double 用 L 后缀。另外 printf 的 %f 接收的是 double：float 实参会被默认参数提升自动转成 double，所以打印 float 也用 %f。" },
        { n: 2, title: "为什么 0.1 + 0.2 == 0.3 是假",
          text: "0.1、0.2、0.3 在二进制里都是无限循环小数，只能用有限位近似存储，int 式的精确相等在这里不成立。正确做法是判断两数之差是否小于一个容差，例如 fabs(a - b) < 1e-9。需要精确十进制（金额、计量）时不要用二进制浮点，改用整数分或十进制库。" },
      ],
      pitfalls: [
        '写 `float f = 3.14;` 会发生 double→float 的隐式收窄；要写 `3.14f`。',
        '不要用 `==` 直接比较两个浮点结果，应判断差值是否小于一个容差（epsilon）。',
        '`float` 存金额、时间戳这类需要精确十进制的值几乎一定出问题；金额用整数分或十进制库。'
      ],
      references: [
        { source: "n1570", topic: "浮点类型与浮点常量" },
        { source: "cert-list", topic: "FLP 章节：浮点比较与转换" }
      ],
      related: ['basic-types', 'integer-types-compared', 'literal-suffixes', 'implicit-conversion']
    },
    {
      id: 'char-variants',
      name: 'char / signed char / unsigned char',
      category: '数据类型',
      aliases: ['字符类型', '三种 char', '符号性', 'char signed', 'unsigned char', '字节', 'byte', '实现定义'],
      summary: '这是三个互不相同的类型；普通 char 有没有符号由编译器和平台决定。',
      syntax: 'char c;               /* 符号性由实现定义 */\nsigned char sc;       /* 明确有符号，-128 ~ 127（典型） */\nunsigned char uc;     /* 明确无符号，0 ~ 255（典型） */',
      code: `#include <stdio.h>
#include <limits.h>

int main(void) {
    /* (1) CHAR_MIN 直接告诉你：这台机器上的 char 有没有符号 */
    printf("CHAR_MIN=%d CHAR_MAX=%d UCHAR_MAX=%u\\n",
           CHAR_MIN, CHAR_MAX, UCHAR_MAX);
    return 0;
}`,
      extra: [
        '三者是**不同类型**：`char`、`signed char`、`unsigned char` 互不等价，函数重载（C++）或指针类型检查时会体现出来。',
        'C 标准只保证 `char` 与另外某一种有相同的表示范围/对齐，具体是哪一种由实现定义；可用 `<limits.h>` 的 `CHAR_MIN` 判断。',
        '标准保证 `sizeof(char) == 1`（一个"字节"就是 char 的大小），但一个字节不一定等于 8 位，用 `CHAR_BIT` 查。',
        '处理任意二进制字节、做位运算、或需要确定的 0~255 值时，用 `unsigned char` 最稳妥。',
        '标准依据：C11 §6.2.5（字符类型）、§5.2.4.2.1（CHAR_BIT / CHAR_MIN）。'
      ],
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "为什么不直接写 -128 ~ 127",
          text: "char、signed char、unsigned char 是三个不同的类型，而普通 char 究竟与后两者中的哪一个等价，是「实现定义」的——由编译器和平台决定。标准只保证 sizeof(char) == 1，也不保证一个字节是 8 位（用 CHAR_BIT 查）。所以处理原始字节、位运算、或需要确定的 0~255 值时，明确写 unsigned char；判断当前平台行为就查 <limits.h> 里的 CHAR_MIN。" },
      ],
      pitfalls: [
        '把 `char` 当小整数参与 `> 127` 的判断，在 char 有符号的平台上会得到负数。',
        '字符串字面量类型是 `char[N]`（C 中不是 `const`），但修改它是未定义行为。',
        '读二进制数据别用 `char` 数组配 `%d` 打印，符号扩展会给出莫名其妙的负数。'
      ],
      references: [
        { source: "n1570", topic: "char / signed char / unsigned char" },
        { source: "cert-int", topic: "显式指定字符类型的符号", section: "INT07-C" }
      ],
      related: ['basic-types', 'signed-unsigned', 'string-null-terminator', 'integer-types-compared']
    },
    {
      id: 'literal-suffixes',
      name: '字面量的进制与后缀',
      category: '数据类型',
      aliases: ['常量后缀', '字面量', '进制', '八进制', '十六进制', 'u', 'l', 'f', 'literal', 'suffix', '0x'],
      summary: '一个数字怎么写，直接决定它的进制和类型：前缀管进制，后缀管类型。',
      syntax: '42      十进制 int\n0x2A    十六进制       052   八进制（注意前导 0）\n42u / 42U   unsigned\n42l / 42L   long      42ll / 42LL  long long\n3.14f  float   3.14  double   3.14L  long double',
      code: `#include <stdio.h>

int main(void) {
    /* 0x 是十六进制；052 以 0 开头，是八进制（等于十进制 42） */
    printf("%d %d %u %.1f\\n", 0x2A, 052, 42u, 3.14f);
    return 0;
}`,
      extra: [
        '整数字面量会按「能容纳它的最小候选类型」选类型：`int` → `long` → `long long`（C11 §6.4.4.1）。',
        '加 `u` 后候选变成 `unsigned int` → `unsigned long` → `unsigned long long`。',
        '`0` 开头是**八进制**：`052` 是 42，不是 52；`08` 直接编译报错。',
        "字符常量 `'A'` 在 C 里类型是 `int`（不是 `char`），这点和 C++ 不同。",
        '字符串字面量 `"hi"` 是 `char[N]` 数组，末尾自动带 `\0`。'
      ],
      level: 'guided',
      pitfalls: [
        '写日期、编号时随手补前导零（`09`、`012`）会变成八进制，甚至编译失败。',
        '超大字面量不加后缀可能溢出候选类型；`1 << 40` 在 32 位 `int` 上是未定义行为，应写 `1LL << 40`。',
        '浮点字面量不加 `f` 就是 `double`，赋给 `float` 会隐式收窄、可能损失精度。'
      ],
      references: [
        { source: "n1570", topic: "整数常量与浮点常量的后缀" }
      ],
      related: ['float-double', 'integer-types-compared', 'implicit-conversion', 'string-null-terminator']
    },
    {
      id: 'implicit-conversion',
      name: '隐式转换与强制转换',
      category: '数据类型',
      aliases: ['类型转换', '隐式转换', '强制转换', '类型提升', '收窄', 'cast', 'conversion', 'promotion', '整数提升'],
      summary: '赋值和运算时编译器会自动转换类型；强制转换只是显式写出来，并不"更安全"。',
      syntax: '(目标类型)表达式        /* 强制转换 */\ndouble d = 3;         /* int → double，隐式 */\nint i = 3.9;          /* double → int，截断 */',
      code: `#include <stdio.h>

int main(void) {
    int a = 7, b = 2;
    /* (1) 先转一个操作数，除法就按 double 算 */
    printf("%.1f\\n", (double)a / b);
    /* (2) 两个 int 相除仍是整数，小数部分已经丢了 */
    printf("%.1f\\n", a / b);
    /* (3) 浮点转整数是向零截断，不是四舍五入 */
    printf("%d\\n", (int)3.9);
    return 0;
}`,
      extra: [
        '**整数提升**：比 `int` 小的类型（`char`、`short`）在参与运算前先提升为 `int` 或 `unsigned int`。',
        '**寻常算术转换**：二元运算的两操作数先转成同一"更宽/更能表示"的类型再计算（C11 §6.3.1.8）。',
        '浮点 → 整数是**向零截断**（丢弃小数），不是四舍五入；且超出目标范围时行为未定义。',
        '优先级口诀：宽类型胜出；同为整数且有符号/无符号混用，无符号胜出（这就是 `-1 < 1u` 为假的来源）。',
        '想避免意外，宁可显式写 `(double)a / b`，也不要依赖隐式规则。'
      ],
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "(double)a / b 的求值顺序",
          text: "强制转换只作用于紧跟着的 a，把 7 变成 7.0。随后 b 因为「寻常算术转换」也被提升为 double，于是整个除法按浮点进行，得到 3.5。想让整数除法出小数，这是标准写法。" },
        { n: 2, title: "对比：为什么 a / b 是 3",
          text: "两个操作数都是 int，编译器直接做整数除法，7 / 2 = 3，小数部分被丢弃。注意 (double)(a / b) 和 (double)a / b 完全不同：前者是先算完 3 再转成 3.0，误差已经产生，括号位置是这类 bug 的高发点。" },
        { n: 3, title: "(int)3.9 得到 3",
          text: "浮点转整数是向零截断（truncation），直接丢掉小数部分，不是四舍五入。若要四舍五入应使用 <math.h> 的 round()。另外，当浮点值超出目标整数类型能表示的范围时，这个转换的行为是未定义的。" },
      ],
      pitfalls: [
        '`(double)(a / b)` 与 `(double)a / b` 完全不同：前者先做整数除法，误差已经产生。',
        '强制转换不能消除越界、溢出或指针类型不匹配带来的未定义行为，它只是让编译器闭嘴。',
        '把大整数（`long long`）赋给 `int`、或把负浮点转无符号，结果都不该想当然。'
      ],
      references: [
        { source: "n1570", topic: "寻常算术转换与强制转换" },
        { source: "cert-int", topic: "整数转换不丢失数据", section: "INT31-C" }
      ],
      related: ['signed-unsigned', 'float-double', 'arithmetic-assignment', 'literal-suffixes']
    },
    {
      id: 'void-type',
      name: 'void 与 void*',
      category: '数据类型',
      aliases: ['空类型', '无类型', '泛型指针', 'void', 'void pointer', '通用指针', '任意类型指针'],
      summary: 'void 表示"没有值/没有类型"；void* 是能存任意对象地址、但不能直接解引用的通用指针。',
      syntax: 'void f(void);         /* 不返回值、不接受参数 */\nvoid *p = &x;         /* 任意对象地址 */\nint *q = p;           /* C 里可隐式转换回来 */',
      code: `#include <stdio.h>

int main(void) {
    int x = 5;
    void *p = &x;                 /* 通用指针能存任意对象的地址 */
    /* printf("%d\\n", *p);  ← 非法：void* 不知道该按几个字节去读 */
    printf("%d\\n", *(int *)p);   /* 转回具体类型后才能解引用 */
    return 0;
}`,
      extra: [
        '`void` 是不完整类型，不能定义 `void v;`，也不能对它做 `sizeof`（标准不允许，部分编译器是扩展）。',
        '`void *` 与任意对象指针之间可以相互转换且保证能还原；**函数指针不在此保证范围内**。',
        'C 里 `void *` 赋给 `int *` 不需要显式转换（`malloc` 返回值可直接接）；**C++ 必须写强转**，这是两语言常见差异。',
        '`void` 用在函数参数里表示"无参数"：`f(void)` 与旧式 `f()` 含义不同。',
        '标准依据：C11 §6.2.5（void）、§6.3.2.3（指针转换）。'
      ],
      level: 'guided',
      pitfalls: [
        '`*p` 对 `void *` 非法，`p++` 也非法（不知道一步跨几个字节）；必须先转成具体类型。',
        '别把 `void *` 当"万能值"传来传去，类型信息丢失后很容易转错类型。',
        '函数返回 `void` 时写 `return f();` 这类用法要注意，别把它当成有返回值。'
      ],
      references: [
        { source: "n1570", topic: "void 类型与 void *" }
      ],
      related: ['pointer-deref', 'malloc-free', 'function-prototype', 'basic-types']
    },
    {
      id: 'enum-type',
      name: 'enum 枚举',
      category: '数据类型',
      aliases: ['枚举', '枚举常量', 'enum', 'enumeration', '命名整数', '符号常量'],
      summary: '给一组整数常量起名字；枚举常量是 int，枚举变量本身是兼容某个整数类型的类型。',
      syntax: 'enum Color { RED, GREEN = 5, BLUE };   /* RED=0 GREEN=5 BLUE=6 */\nenum Color c = GREEN;',
      code: `#include <stdio.h>

/* (1) 不给值就从 0 开始；给了值之后，后面的依次 +1 */
enum Color { RED, GREEN = 5, BLUE };

int main(void) {
    enum Color c = GREEN;
    printf("%d %d %d\\n", RED, c, BLUE);
    return 0;
}`,
      extra: [
        '不给值时从 `0` 开始；给了值之后，后面的常量依次 `+1`。',
        '枚举常量在 C 里类型是 `int`（C++ 不同），所以可以直接用于 `case` 标签和数组长度。',
        '与 `#define` 相比：枚举有名字作用域、调试器能看到符号、编译器能做一定检查；与 `const int` 相比：枚举常量可作常量表达式。',
        '标准依据：C11 §6.7.2.2（枚举说明符）。'
      ],
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "枚举值是怎么算出来的",
          text: "RED 没写值，取 0；GREEN 显式给了 5；BLUE 紧跟其后，自动变成 6，所以输出是 0 5 6。C 里枚举常量的类型是 int，可以直接用在 case 标签、数组长度这类需要常量表达式的位置——这一点和 const int 不同。若两个枚举里出现同名常量，会因为共享同一作用域而冲突。" },
      ],
      pitfalls: [
        '枚举值是整数，不自带"非法值"检查：`(enum Color)99` 也能塞进去。',
        '不同枚举类型的常量共享同一作用域，别在两个 enum 里起同名常量。',
        '枚举变量的实际底层类型由实现选择，别假设它一定是 `int` 或一定占 4 字节。'
      ],
      references: [
        { source: "n1570", topic: "枚举说明符与枚举常量" },
        { source: "cert-int", topic: "枚举常量取值范围", section: "INT09-C" }
      ],
      related: ['define-macro', 'const-qualifier', 'switch-case', 'basic-types']
    },
    {
      id: 'static-local-global',
      name: 'static 的两种含义',
      category: '变量与常量',
      aliases: ['静态变量', '静态局部', '静态全局', '内部链接', 'static', '存储期', '生命周期', '只初始化一次'],
      summary: '同一个关键字，在函数内表示"活得久"，在文件作用域表示"别的文件看不见"。',
      syntax: 'static int g;             /* 文件作用域：内部链接，仅本文件可见 */\nvoid f(void) { static int n = 0; n++; }  /* 局部：静态存储期，只初始化一次 */',
      code: `#include <stdio.h>

void counter(void) {
    /* (1) 静态局部变量只初始化一次，调用之间保留上一次的值 */
    static int n = 0;
    n++;
    printf("%d ", n);
}

int main(void) {
    counter(); counter(); counter();   /* 输出 1 2 3 */
    printf("\\n");
    return 0;
}`,
      extra: [
        '**函数内的 `static` 局部变量**：静态存储期，程序结束时才销毁；初始化只发生一次（且在 main 之前，常量初始化）。',
        '**文件作用域的 `static` 变量/函数**：把链接属性从外部链接改成**内部链接**，其它源文件看不见，可避免命名冲突。',
        '未显式初始化的静态存储期对象会被自动零初始化，局部变量（自动存储期）则不会。',
        '`static` 与 `extern` 说的是"链接/存储期"，`const` 说的是"能否修改"，三者互不冲突。',
        '标准依据：C11 §6.2.2（链接）、§6.2.4（存储期）、§6.7.1（存储类说明符）。'
      ],
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "static 局部变量「活得久」但「看不远」",
          text: "static int n 的作用域仍只在 counter() 函数内部，别的文件、甚至函数外都看不见这个名字；但它的存储期是静态的，程序一开始就分配并保持到结束，所以三次调用会依次打印 1 2 3，而不是每次都打印 1。同一个 static 关键字写在文件作用域时含义完全不同：那里它表示「内部链接」，让变量或函数只在本源文件可见。" },
      ],
      pitfalls: [
        '别把 `static` 局部变量理解成"全局可见"：作用域仍只在函数内，只是生命周期变长。',
        '带 `static` 局部状态的函数不可重入，多线程或递归场景要格外小心。',
        '头文件里定义 `static` 变量会让每个包含它的源文件各得一份副本，通常不是你想要的。'
      ],
      references: [
        { source: "n1570", topic: "存储期、作用域与链接" }
      ],
      related: ['declare-define', 'const-qualifier', 'variable-scope', 'function-prototype']
    },
    {
      id: 'variable-scope',
      name: '作用域与生命周期',
      category: '变量与常量',
      aliases: ['作用域', '生命周期', '局部变量', '全局变量', '块作用域', '生存期', 'scope', 'lifetime', '存储期'],
      summary: '作用域回答"哪里能看见这个名字"，生命周期回答"这块内存什么时候还在"。',
      syntax: 'int g;                /* 文件作用域 + 静态存储期 */\nvoid f(void) {\n    int x;             /* 块作用域 + 自动存储期 */\n    { int y; }         /* y 只在这个内层块可见 */\n}',
      code: `#include <stdio.h>

int g = 1;                       /* 文件作用域：整个文件可见 */

int main(void) {
    int x = 2;                   /* 块作用域 */
    {
        int y = 3;               /* (1) 内层块，只在这个花括号里活着 */
        printf("%d %d %d\\n", g, x, y);
    }
    /* (2) printf("%d", y);  ← 出了这个块，y 这个名字就不存在了 */
    return 0;
}`,
      extra: [
        '**作用域**是编译期概念（名字的可见范围）：文件、块、函数原型、函数四种。',
        '**存储期**是运行期概念（对象何时存在）：自动、静态、线程、动态分配四种。',
        '两者可以任意组合：`static int n` 在函数内是「块作用域 + 静态存储期」——名字只在块里能用，但值一直留着。',
        '自动存储期变量出块即失效，返回其地址是典型的悬空指针来源。',
        '标准依据：C11 §6.2.1（作用域）、§6.2.4（存储期）。'
      ],
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "作用域 vs 生命周期",
          text: "作用域回答「哪里能看见这个名字」，生命周期回答「这块内存什么时候还在」，是两个独立维度。y 的作用域是内层花括号，存储期是自动的，出块即失效。对比一下：函数内的 static int n 是「块作用域 + 静态存储期」——名字只在块内能写，但值一直留着。" },
        { n: 2, title: "指针比对象活得久，就会悬空",
          text: "把 y 的地址存到外面的指针里再出块，指针变量本身还在，但它指向的对象已经失效，读写它就是未定义行为。返回局部变量地址是同一个问题的典型来源。" },
      ],
      pitfalls: [
        '内层块可以定义与外层同名的变量并遮蔽（shadow）它，容易误读；编译时建议开 `-Wshadow`。',
        '不要把"生命周期结束了"和"指针还指向那里"混为一谈：指针变量本身可能还在，指向的对象已经无效。',
        '全局变量不初始化会是 0，局部变量不初始化就读是未定义行为。'
      ],
      references: [
        { source: "n1570", topic: "标识符的作用域" },
        { source: "cert-list", topic: "DCL30-C 使用合适的存储期" }
      ],
      related: ['declare-define', 'static-local-global', 'dangling-leak', 'pointer-deref']
    },
    {
      id: 'while-do-while',
      name: 'while 与 do-while',
      category: '控制结构',
      aliases: ['循环', '当型循环', '直到型循环', '至少执行一次', 'while', 'do while', 'loop', '条件循环'],
      summary: 'while 先判断再执行（可能一次都不做），do-while 先执行再判断（至少做一次）。',
      syntax: 'while (条件) { 语句 }\ndo { 语句 } while (条件);   /* 末尾分号不能漏 */',
      code: `#include <stdio.h>

int main(void) {
    int i = 0;
    while (i < 3) { printf("w%d ", i); i++; }

    int j = 0;
    do { printf("d%d ", j); j++; } while (j < 3);
    printf("\\n");
    return 0;
}`,
      extra: [
        '`do-while` 的条件在循环体**之后**求值，因此循环体保证至少执行一次。',
        '`do { ... } while (0);` 是写多行宏的标准惯用法，能把多条语句包成一个语句（见「带参宏的括号坑」）。',
        '已知次数用 `for`，次数不定但要先判断用 `while`，至少要执行一次（如菜单、重试输入）用 `do-while`。',
        '标准依据：C11 §6.8.5（迭代语句）。'
      ],
      level: 'basic',
      pitfalls: [
        '`do { ... } while (条件);` 末尾必须写分号，漏掉会编译报错。',
        '`while (条件);` 后面多一个分号会让循环体变成空语句，可能直接死循环。',
        '循环体里必须有能改变条件的语句；浮点条件尤其别用 `==` 判断退出。'
      ],
      references: [
        { source: "n1570", topic: "迭代语句" }
      ],
      related: ['for-loop', 'switch-case', 'macro-pitfall']
    },
    {
      id: 'break-continue',
      name: 'break 与 continue',
      category: '控制结构',
      aliases: ['跳出循环', '跳过本次', '中断', '继续', 'break', 'continue', '循环控制'],
      summary: 'break 结束整个循环/switch，continue 只跳过本轮剩余语句进入下一轮。',
      syntax: 'for (...) { if (...) break;    /* 整个循环结束 */\n             if (...) continue; /* 直接到更新表达式 */ }',
      code: `#include <stdio.h>

int main(void) {
    for (int i = 0; i < 5; i++) {
        if (i == 3) break;       /* 整个循环到此结束 */
        if (i == 1) continue;    /* 跳到 i++，本轮后面的 printf 不执行 */
        printf("%d ", i);        /* 输出 0 2 */
    }
    printf("\\n");
    return 0;
}`,
      extra: [
        '`break` 只跳出**最近一层**循环或 `switch`，不会一次跳出多层嵌套。',
        '在 `for` 里 `continue` 会跳到**更新表达式**（`i++`）再判断条件；在 `while` 里则直接去判断条件——若在 `while` 里把 `i++` 写在 `continue` 之后，就会死循环。',
        '`switch` 里的 `continue` 只有当这个 `switch` 位于循环内部时才有效，作用于外层循环。',
        '标准依据：C11 §6.8.6.2 / §6.8.6.3。'
      ],
      level: 'guided',
      pitfalls: [
        '在 `while` 循环里用 `continue` 前，务必确认计数变量已经更新。',
        '别指望 `break` 能跳出多层循环；需要时改条件标志或把循环拆成函数。',
        '`switch` 的 `case` 里漏写 `break` 会穿透到下一个 `case`，和循环里的 `break` 不是一回事。'
      ],
      references: [
        { source: "n1570", topic: "break 与 continue 语句" }
      ],
      related: ['for-loop', 'while-do-while', 'switch-case']
    },
    {
      id: 'array-vs-pointer',
      name: '数组与指针的区别',
      category: '指针',
      aliases: ['数组和指针', '退化', '区别', 'array vs pointer', 'sizeof 差异', '可赋值', '首元素地址'],
      summary: '数组是一整块对象，指针只是一个地址变量；数组名在多数表达式里会退化成指针，但两者不是一回事。',
      syntax: 'int a[5];      /* 数组：sizeof(a) = 5 * sizeof(int) */\nint *p = a;    /* 指针：sizeof(p) = 指针大小 */\na = p;         /* 非法：数组名不可赋值 */',
      code: `#include <stdio.h>

/* (1) 写成 int arr[] 也只是「看起来像数组」，实际参数类型仍是 int * */
void show(int arr[]) {
    printf("函数内 sizeof=%zu\\n", sizeof(arr));
}

int main(void) {
    int a[5] = {1, 2, 3, 4, 5};
    int *p = a;
    /* (2) 同一个 sizeof，作用在数组和指针上结果完全不同 */
    printf("数组 sizeof=%zu 指针 sizeof=%zu\\n", sizeof(a), sizeof(p));
    show(a);
    return 0;
}`,
      extra: [
        '**不退化**的三种场合：`sizeof(a)`、`&a`、以及用字符串字面量初始化字符数组时。',
        '`&a` 的类型是「指向整个数组的指针」`int (*)[5]`，`&a + 1` 跨过整个数组；`a` 退化后是 `int *`，`a + 1` 只跨一个元素。',
        '函数参数写成 `int arr[]` 与 `int *arr` 完全等价，编译器都当指针处理，所以要额外传长度。',
        '数组是**不可修改的左值**，不能整体赋值；要拷贝用循环或 `memcpy`。',
        '标准依据：C11 §6.3.2.1（数组到指针的转换）、§6.7.6.3（函数参数中的数组声明）。'
      ],
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "函数参数里的方括号是障眼法",
          text: "C 标准规定，声明为「数组类型」的函数参数会被调整为「指向其元素类型的指针」。所以 void show(int arr[]) 与 void show(int *arr) 完全等价，函数内 sizeof(arr) 得到的是指针大小，不是整个数组。要在被调函数里知道长度，只能额外传一个长度参数。" },
        { n: 2, title: "sizeof(a) 与 sizeof(p) 的差别",
          text: "a 是「5 个 int 的数组」这个对象本身，sizeof(a) = 5 * sizeof(int)；p 只是一个地址变量，sizeof(p) 是指针宽度。因此 sizeof(a)/sizeof(a[0]) 在数组所在作用域能算出 5，一旦传进函数就只剩指针，再这么算就错了。数组还不能整体赋值（a = p 非法），要拷贝得用循环或 memcpy。" },
      ],
      pitfalls: [
        '在被调函数里用 `sizeof(arr)/sizeof(arr[0])` 求元素个数会得到错误结果（得到的是指针大小之比）。',
        '返回局部数组的地址是悬空指针；要返回可用静态存储期、动态分配，或让调用方传入缓冲区。',
        '别把 `char *s = "hi";`（指针指向字面量）与 `char s[] = "hi";`（数组副本可修改）混为一谈。'
      ],
      references: [
        { source: "n1570", topic: "数组到指针的转换与参数调整", section: "§6.3.2.1p3 / §6.7.6.3p7" },
        { source: "cert-c", topic: "ARR 章节：数组相关规则" }
      ],
      related: ['pointer-array', 'array-1d', 'sizeof-operator', 'string-null-terminator']
    },

    /* ----------------------------- 变量与常量 ----------------------------- */
    {
      id: 'declare-define',
      name: '声明与定义',
      category: '变量与常量',
      aliases: ['声明', '定义', '初始化', '变量', 'declaration', 'definition', 'extern', 'declare'],
      summary: '声明告诉编译器"有这个东西"，定义才真正分配存储空间。',
      syntax: 'extern int g;      /* 声明，不分配空间 */\nint g = 1;         /* 定义，分配空间 */\nint x;             /* 定义（未初始化） */',
      code: `#include <stdio.h>

int global = 7;              /* 定义 */

int main(void) {
    extern int global;       /* 声明：用的是上面那个 */
    int local = 3;           /* 定义并初始化 */
    printf("%d %d\\n", global, local);
    return 0;
}`,
      extra: [
        '一句口诀：**声明引入名字，定义分配存储**。函数原型、带 `extern` 且无初始化的变量声明都属于前者。',
        '带 `extern` 且有初始化（如 `extern int g = 1;`）是定义，不要被 `extern` 迷惑。',
        '头文件里应放声明而非定义；多个源文件包含同一个定义会导致链接期重复定义错误。',
        '「作用域 / 生命周期 / 链接」是三个不同维度，见「作用域与生命周期」「static 的两种含义」。'
      ],
      level: 'basic',
      pitfalls: [
        '同一个全局变量可以被声明多次，但只能被定义一次。',
        '局部变量不初始化就读取是未定义行为；全局变量不写初值会被自动置 0。',
        'extern int g; 与 extern int g = 1; 不同，后者带了初始化就是定义。'
      ],
      references: [
        { source: "n1570", topic: "声明与定义的区别" },
        { source: "cert-list", topic: "DCL40-C 不要写出不兼容的声明" }
      ],
      related: ['const-qualifier', 'function-prototype', 'variable-scope', 'static-local-global']
    },
    {
      id: 'const-qualifier',
      name: 'const 限定符',
      category: '变量与常量',
      aliases: ['常量', '只读', '不可修改', 'const', 'constant', 'qualifier', '限定符'],
      summary: '告诉编译器这个对象不能被修改；它不是"编译期常量表达式"。',
      syntax: 'const int n = 10;\nconst char *p;        /* 指向的内容只读 */\nchar *const p;        /* 指针本身只读 */',
      code: `#include <stdio.h>

int main(void) {
    const int n = 10;
    /* n = 20;  ← 去掉注释会编译报错 */
    printf("%d\\n", n);
    return 0;
}`,
      extra: [
        '记忆法：看 `const` 在 `*` 的哪一侧 —— 左侧锁「指向的内容」，右侧锁「指针本身」。',
        '`const int n = 10;` 在 C 里是**只读对象**，不是常量表达式；`case n:`、普通数组 `int a[n];` 都不行（改用枚举或 `#define`）。',
        '`const` 修饰的是"通过这个名字不能改"，不代表底层对象真的不可写（例如 `const` 指针参数指向的原变量仍可被别人修改）。',
        '标准依据：C11 §6.7.3（类型限定符）。'
      ],
      level: 'basic',
      pitfalls: [
        'const 变量不等于常量表达式，不能用来做 case 标签或普通数组的长度（C 里不行）。',
        'const char *p 与 char *const p 含义不同：const 在 * 左边锁内容，在 * 右边锁指针。',
        '通过强制转换绕过 const 去改真正的常量对象，属于未定义行为。'
      ],
      references: [
        { source: "n1570", topic: "类型限定符 const" },
        { source: "n1570", topic: "const 在指针声明中的位置" }
      ],
      related: ['declare-define', 'pointer-deref', 'enum-type', 'define-macro']
    },

    /* ------------------------------- 运算符 ------------------------------- */
    {
      id: 'arithmetic-assignment',
      name: '算术与赋值运算符',
      category: '运算符',
      aliases: ['加减乘除', '取模', '求余', '赋值', '自增', '自减', '%', '++', 'arithmetic', 'assignment', 'operator'],
      summary: '+ - * / % 与 = += -= 等，整数除法会直接丢掉小数部分。',
      syntax: 'a + b   a - b   a * b   a / b   a % b\na += b   a -= b   a *= b   a++   ++a',
      code: `#include <stdio.h>

int main(void) {
    int a = 7, b = 2;
    printf("%d %d %d\\n", a / b, a % b, a * b);
    a += 3;                 /* 等价于 a = a + 3 */
    printf("%d\\n", a);
    return 0;
}`,
      extra: [
        '复合赋值 `a += b` 等价于 `a = a + b`，但 `a` 只求值一次（当 `a` 是带副作用的表达式时这点有区别）。',
        '整数 `/` 向零截断；`%` 的符号与被除数一致（`-7 % 2` 得 `-1`），这是 C99 之后的规定。',
        '`i++` 返回**旧值**，`++i` 返回**新值**；单独成句时两者效果相同，编译器生成的指令通常也一样。',
        '想让除法出小数，先转一个操作数：`(double)a / b`，而不是 `(double)(a / b)`。'
      ],
      level: 'guided',
      pitfalls: [
        '两个整数相除结果仍是整数：7 / 2 得 3，不是 3.5；想要小数先把一个操作数转成 double。',
        '% 只能用于整数，且除数为 0 是未定义行为。',
        'i++ 与 ++i 单独用时效果一样，但嵌在表达式里取值时机不同；同一表达式里别多次修改 i。'
      ],
      references: [
        { source: "n1570", topic: "算术运算符与复合赋值" },
        { source: "cert-int", topic: "除零与整数溢出", section: "INT32-C / INT33-C" }
      ],
      related: ['operator-precedence', 'bitwise-operators', 'implicit-conversion']
    },
    {
      id: 'operator-precedence',
      name: '运算符优先级速查',
      category: '运算符',
      aliases: ['优先级', '结合性', '运算顺序', '优先级表', '括号', 'precedence', 'associativity', 'order'],
      summary: '记不住就加括号；最容易出事的是 * & 与 ++、以及位运算与比较的先后。',
      syntax: '高 → 低（常用部分）\n()  []  ->  .        \n!  ~  ++  --  (类型)  *  &  sizeof   /* 单目，右结合 */\n*  /  %             \n+  -                \n<<  >>              \n<  <=  >  >=        \n==  !=              \n&  ^  |             \n&&  ||              \n?:                  \n=  +=  -=  ...      /* 右结合 */\n,                   ',
      code: `#include <stdio.h>

int main(void) {
    int a = 1, b = 2, c = 3;
    printf("%d\\n", a + b * c);            /* 先乘后加 → 7 */
    printf("%d\\n", (a + b) * c);          /* 加括号 → 9 */
    /* (1) == 优先于 &，必须自己加括号把这些位运算括起来 */
    printf("%d\\n", (a & b) == 0 ? 1 : 0);
    return 0;
}`,
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "为什么 (a & b) == 0 的括号不能省",
          text: "在 C 的优先级表里，相等运算符 == 高于按位与 &。如果写成 a & b == 0，会被解析成 a & (b == 0)，意思完全变了。同理 *p++ 是 *(p++) 而不是 (*p)++。这类优先级坑没有好记的捷径：涉及位运算、单目运算和比较混写时，一律加括号把意图写清楚。另外优先级只决定「谁和谁结合」，不决定求值顺序——f() + g() 谁先调用并没有规定。" },
      ],
      pitfalls: [
        '*p++ 等价于 *(p++)，不是 (*p)++；想给值加一要写 (*p)++。',
        'a & b == 0 会被解析成 a & (b == 0)，因为 == 优先于 &；必须写 (a & b) == 0。',
        '赋值是右结合：a = b = 0 等价于 a = (b = 0)。',
        '优先级只决定"谁和谁结合"，不决定求值顺序；f() + g() 谁先调用没有规定。'
      ],
      references: [
        { source: "n1570", topic: "运算符优先级与求值顺序", section: "§6.5p3" },
        { source: "cert-list", topic: "EXP30-C 不要依赖求值顺序" }
      ],
      related: ['arithmetic-assignment', 'bitwise-operators']
    },
    {
      id: 'bitwise-operators',
      name: '位运算符',
      category: '运算符',
      aliases: ['位与', '位或', '异或', '取反', '左移', '右移', '移位', 'bitwise', 'bit', '&', '|', '^', '~', 'mask'],
      summary: '直接操作二进制位，常用于标志位、掩码与底层寄存器。',
      syntax: '& 与   | 或   ^ 异或   ~ 取反\n<< 左移   >> 右移',
      code: `#include <stdio.h>

int main(void) {
    unsigned int flags = 0u;
    /* (1) 置位：1u << 2 造出只有第 2 位是 1 的掩码，再用 |= 合并 */
    flags |= 1u << 2;
    /* (2) 读位：右移到最低位后，用 & 1u 把其它位抹掉 */
    printf("%u\\n", (flags >> 2) & 1u);
    /* (3) 清位：~ 取反造出「第 2 位为 0、其余为 1」的掩码 */
    flags &= ~(1u << 2);
    printf("%u\\n", flags);
    return 0;
}`,
      extra: [
        '常用三件套：`flags |= 1u << k` 置位、`flags &= ~(1u << k)` 清位、`(flags >> k) & 1u` 读位。',
        '`^` 的性质：`a ^ a == 0`、`a ^ 0 == a`，可用于翻转标志位，但别拿它当"交换两个变量"的技巧（可读性差且同一对象会归零）。',
        '`&&` / `||` 有**短路求值**，而 `&` / `|`（按位）两侧都会求值 —— 这是两者最实质的行为差别。',
        '移位建议一律用无符号类型与无符号字面量 `1u`，避开符号位带来的实现定义行为。'
      ],
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "置位三件套之一：flags |= 1u << k",
          text: "1u << 2 得到二进制 100（十进制 4）。按位或 | 的规则是「有 1 就为 1」，所以 |= 能把第 k 位设成 1，同时不影响其它位。用无符号的 1u 是为了避开有符号左移可能溢出的实现定义行为。" },
        { n: 2, title: "读位：为什么还要 & 1u",
          text: "flags >> 2 把目标位挪到最低位，但更高位可能还残留别的值。再 & 1u（二进制只有最低位是 1）就把其它位全抹成 0，结果必然是 0 或 1，可以直接当真假用。" },
        { n: 3, title: "清位：~ 与 &= 的配合",
          text: "~(1u << 2) 把 100 取反成 ...11111011，也就是「只有第 2 位是 0」。按位与 & 的规则是「有 0 就为 0」，于是 &= 精确清掉这一位而不动其它位。注意别把 & 写成 &&：后者是逻辑与，会把整个数当真假判断。" },
      ],
      pitfalls: [
        '别把 & 写成 &&、| 写成 ||：前者按位，后者逻辑判断，结果完全不同。',
        '移位位数为负或大于等于类型宽度是未定义行为。',
        '对有符号数做右移、左移溢出，结果依赖实现；位运算尽量用 unsigned。'
      ],
      references: [
        { source: "n1570", topic: "按位运算符" },
        { source: "n1570", topic: "移位位数与符号的规则" }
      ],
      related: ['operator-precedence', 'arithmetic-assignment', 'signed-unsigned']
    },

    /* ------------------------------ 控制结构 ------------------------------ */
    {
      id: 'if-else',
      name: 'if - else',
      category: '控制结构',
      aliases: ['条件', '分支', '判断', '条件判断', 'if', 'else', 'else if', 'conditional', 'branch'],
      summary: '按条件选择执行路径；C 里任何非 0 值都算"真"。',
      syntax: 'if (条件) { 语句 }\nelse if (条件) { 语句 }\nelse { 语句 }',
      code: `#include <stdio.h>

int main(void) {
    int n = -1;
    if (n > 0) {
        printf("正数\\n");
    } else if (n == 0) {
        printf("零\\n");
    } else {
        printf("负数\\n");
    }
    return 0;
}`,
      level: 'basic',
      pitfalls: [
        '判断相等用 ==，写成 = 会变成赋值，且编译器未必报错。',
        'C 没有布尔语义的强制约束：-1、指针非 NULL 都是真，别写 if (x == 1) 去判断"真"。',
        'else 总是和最近的、尚未配对的 if 配对；多层嵌套请一律加花括号。'
      ],
      references: [
        { source: "n1570", topic: "选择语句" }
      ],
      related: ['switch-case', 'for-loop']
    },
    {
      id: 'switch-case',
      name: 'switch - case',
      category: '控制结构',
      aliases: ['多分支', '开关', '分支', 'switch', 'case', 'default', 'break', '穿透', 'fallthrough'],
      summary: '按整型表达式的值跳到对应 case，适合取值离散的多路分支。',
      syntax: 'switch (整型表达式) {\n    case 常量: 语句; break;\n    default:   语句;\n}',
      code: `#include <stdio.h>

int main(void) {
    int op = 2;
    switch (op) {
        case 1:  printf("新增\\n"); break;
        case 2:  printf("删除\\n"); break;
        default: printf("未知\\n"); break;
    }
    return 0;
}`,
      level: 'basic',
      pitfalls: [
        '忘记 break 会"穿透"到下一个 case，这是最常见的 bug；确实需要穿透时写注释说明。',
        'case 后面只能是整型常量表达式，不能用变量、字符串或范围。',
        'switch 的表达式必须是整型（含 char、枚举），不能是 float 或字符串。'
      ],
      references: [
        { source: "n1570", topic: "switch 语句与 case 标号" },
        { source: "n1570", topic: "条件表达式的替代写法" }
      ],
      related: ['if-else', 'for-loop']
    },
    {
      id: 'for-loop',
      name: 'for 循环',
      category: '控制结构',
      aliases: ['循环', '迭代', '遍历', '重复执行', 'for', 'loop', 'iteration', 'iterate'],
      summary: '把初始化、条件、更新写在一行，适合次数明确的重复执行。',
      syntax: 'for (初始化; 条件; 更新) { 语句 }',
      code: `#include <stdio.h>

int main(void) {
    for (int i = 0; i < 5; i++) {
        printf("%d ", i);
    }
    printf("\\n");
    return 0;
}`,
      level: 'basic',
      pitfalls: [
        'for (...); 后面多写一个分号，循环体就变成空语句，下面的代码块只会执行一次。',
        '在 C99 及以上才能写 for (int i = ...)；老编译器要在外面先声明 i。',
        '循环里用 < 而不是 <= 配合数组长度，避免越界访问 a[n]。'
      ],
      references: [
        { source: "n1570", topic: "迭代语句 for" }
      ],
      related: ['if-else', 'array-1d']
    },

    /* -------------------------------- 函数 -------------------------------- */
    {
      id: 'function-prototype',
      name: '函数定义与原型',
      category: '函数',
      aliases: ['函数', '原型', '函数声明', '定义', 'function', 'prototype', 'declaration', 'return'],
      summary: '先声明（原型）让调用点知道签名，再在某处给出唯一的定义。',
      syntax: '返回类型 函数名(参数列表);          /* 原型 */\n返回类型 函数名(参数列表) { ... }   /* 定义 */',
      code: `#include <stdio.h>

int add(int a, int b);           /* 原型 */

int main(void) {
    printf("%d\\n", add(2, 3));
    return 0;
}

int add(int a, int b) {          /* 定义 */
    return a + b;
}`,
      level: 'basic',
      pitfalls: [
        '函数定义可以放在调用之后，但调用前必须能看到原型，否则老标准会猜错参数类型。',
        '无参数要写 (void)；空括号 () 在旧式声明里表示"参数未指定"。',
        '声明了非 void 返回类型就必须所有路径都有 return，否则返回值是未定义的。'
      ],
      references: [
        { source: "n1570", topic: "函数声明与原型" },
        { source: "cert-list", topic: "DCL40-C / EXP37-C 声明一致与调用正确" }
      ],
      related: ['main-function', 'pass-by-value']
    },
    {
      id: 'pass-by-value',
      name: '参数的值传递',
      category: '函数',
      aliases: ['参数', '形参', '实参', '传值', '拷贝', 'pass by value', 'parameter', 'argument', '值传递'],
      summary: 'C 只有值传递：函数拿到的是实参的副本，想改外面的变量得传指针。',
      syntax: 'void f(int x)          /* 改不了调用者的变量 */\nvoid f(int *p)         /* 通过 *p 可以改 */',
      code: `#include <stdio.h>

/* 形参 x 只是实参的一份副本，改它不影响调用者 */
void bump(int x)      { x = x + 1; }
/* 想改外面的变量，就得把地址传进来，通过地址间接写 */
void bump_ptr(int *p) { *p = *p + 1; }

int main(void) {
    int n = 1;
    bump(n);
    printf("%d\\n", n);   /* 1，没变 */
    bump_ptr(&n);
    printf("%d\\n", n);   /* 2，变了 */
    return 0;
}`,
      level: 'guided',
      pitfalls: [
        '数组名作为参数时会退化成指向首元素的指针，所以函数里能改到原数组——这不是"引用传递"。',
        '想修改指针变量本身（让它指向别处），需要传二级指针 int **。',
        '别返回局部变量的地址：函数返回后那块栈内存就失效了。'
      ],
      references: [
        { source: "n1570", topic: "函数调用与参数传递" },
        { source: "n1570", topic: "需要修改指针变量本身时的做法" }
      ],
      related: ['function-prototype', 'pointer-deref']
    },

    /* ---------------------------- 数组与字符串 ---------------------------- */
    {
      id: 'array-1d',
      name: '一维数组',
      category: '数组与字符串',
      aliases: ['数组', '下标', '索引', '元素', 'array', 'index', '初始化', '越界'],
      summary: '连续存放的一组同类型元素，下标从 0 开始。',
      syntax: '类型 数组名[长度];\n类型 数组名[] = { 值1, 值2, ... };',
      code: `#include <stdio.h>

int main(void) {
    int a[5] = {1, 2, 3};       /* 后两个自动补 0 */
    int n = (int)(sizeof(a) / sizeof(a[0]));
    for (int i = 0; i < n; i++) {
        printf("%d ", a[i]);
    }
    printf("\\n");
    return 0;
}`,
      level: 'basic',
      pitfalls: [
        '合法下标是 0 ~ n-1；访问 a[n] 属于越界，是未定义行为，编译器通常不检查。',
        '数组长度在定义时必须是常量（C99 的变长数组 VLA 是例外，且不推荐）。',
        '数组不能整体赋值：a = b; 非法，要逐个元素或用 memcpy。'
      ],
      references: [
        { source: "n1570", topic: "数组声明与初始化" },
        { source: "cert-c", topic: "ARR 章节：数组下标边界" }
      ],
      related: ['sizeof-operator', 'pointer-array', 'string-null-terminator']
    },
    {
      id: 'string-null-terminator',
      name: '字符数组与 \\0',
      category: '数组与字符串',
      aliases: ['字符串', '结束符', '空字符', '字符数组', 'string', 'null terminator', 'terminator', 'strlen'],
      summary: 'C 字符串是"以 \\0 结尾的 char 数组"，没有独立的字符串类型。',
      syntax: 'char s[] = "hi";       /* 实际存了 3 个 char：h i \\0 */\nchar s2[] = {\'h\', \'i\', \'\\0\'};',
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char s[] = "hi";       /* 编译器自动在末尾补一个 \0 */
    /* sizeof 算的是数组，strlen 只数到 \0 之前，两者差 1 */
    printf("数组长度=%zu 字符串长度=%zu\\n", sizeof(s), strlen(s));
    return 0;
}`,
      level: 'guided',
      pitfalls: [
        'sizeof(s) 算上结尾的 \\0，strlen(s) 不算；给字符数组开空间时要多留 1 个字节。',
        '手写 { \'h\', \'i\' } 不带 \\0 就不是字符串，交给 strlen / printf("%s") 会一直读到越界。',
        'char *p = "hi"; 指向的是只读的字面量，改内容是未定义行为；要改就用 char s[]。'
      ],
      references: [
        { source: "n1570", topic: "字符串字面量与 \\0 结束符" },
        { source: "n1570", topic: "strlen 与 strcpy 的行为" }
      ],
      related: ['array-1d', 'pointer-array']
    },

    /* -------------------------------- 指针 -------------------------------- */
    {
      id: 'pointer-deref',
      name: '取址 & 与解引用 *',
      category: '指针',
      aliases: ['指针', '地址', '取地址', '解引用', '间接访问', 'pointer', 'address', 'dereference', '&', '*'],
      summary: '& 取变量的地址，* 顺着地址访问那个对象。',
      syntax: 'int *p = &x;    /* p 保存 x 的地址 */\n*p = 10;        /* 通过 p 改写 x */',
      code: `#include <stdio.h>

int main(void) {
    int x = 5;
    /* (1) 声明里的 * 是类型的一部分；这一行的 & 取出 x 的地址 */
    int *p = &x;
    /* (2) 语句里的 * 是解引用：顺着 p 找到 x 并改写它 */
    *p = 9;
    /* (3) %p 打印地址，按标准要转成 void * */
    printf("x=%d *p=%d p=%p\\n", x, *p, (void *)p);
    return 0;
}`,
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "两个 * 长得一样，意思不同",
          text: "int *p = &x; 里的 * 属于类型说明「p 是指向 int 的指针」；而 *p = 9; 里的 * 是解引用运算符「访问 p 指向的那个 int」。&x 则取出 x 的地址交给 p 保存。初学最容易混的就是把声明里的 * 也当成解引用去读。" },
        { n: 2, title: "为什么改 *p 会改变 x",
          text: "p 里存的是 x 的地址，*p 就是那个地址上的对象本身，也就是 x 的别名。因此给 *p 赋值等于给 x 赋值，打印出来 x 和 *p 都是 9。这也是「想让函数修改外部变量就传指针」的底层原因。" },
        { n: 3, title: "%p 为什么要 (void *)",
          text: "printf 是可变参数函数，标准规定 %p 对应的是 void *。虽然多数平台上 int * 与 void * 的表示一样，但直接传 int * 在严格意义上类型不匹配，属于未定义行为。显式转成 (void *) 是稳妥写法。" },
      ],
      pitfalls: [
        '声明里的 * 是类型的一部分（int *p），语句里的 * 是解引用，两个含义别混。',
        '未初始化的指针（野指针）直接解引用是未定义行为；定义时先置 NULL。',
        '打印地址用 %p，并把指针转成 (void *) 以匹配可变参数的类型要求。'
      ],
      references: [
        { source: "n1570", topic: "一元 & 与 * 运算符" }
      ],
      related: ['pass-by-value', 'pointer-array', 'malloc-free']
    },
    {
      id: 'pointer-array',
      name: '指针与数组',
      category: '指针',
      aliases: ['数组名', '退化', '指针运算', '首元素', 'pointer arithmetic', 'array decay', '偏移'],
      summary: '数组名在多数表达式里会变成指向首元素的指针，a[i] 等价于 *(a + i)。',
      syntax: 'int a[3];\nint *p = a;        /* 等价于 &a[0] */\na[i]  ==  *(a + i)',
      code: `#include <stdio.h>

int main(void) {
    int a[3] = {10, 20, 30};
    /* (1) 数组名在这里退化成指向首元素的指针 */
    int *p = a;
    /* (2) 下标本质是「首地址 + 偏移」再解引用 */
    printf("%d %d %d\\n", a[1], *(a + 1), *(p + 1));
    /* (3) 同一数组内的指针相减，结果类型是 ptrdiff_t */
    printf("%td\\n", p - a);
    return 0;
}`,
      extra: [
        '`a[i]` 在标准里就定义为 `*(a + i)`，所以 `i[a]` 也合法（不推荐写）—— 这能说明下标本质是指针运算。',
        '指针相减只在**同一数组内**有定义，结果类型是 `ptrdiff_t`，打印用 `%td`。',
        '数组名不退化成指针的场合只有三种：`sizeof(a)`、`&a`、字符串字面量初始化字符数组。',
        '标准依据：C11 §6.3.2.1（数组转换）、§6.5.6（指针加减）。'
      ],
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "数组名什么时候变成指针",
          text: "除了 sizeof(a)、&a、以及用字符串字面量初始化字符数组这三种场合，数组名在表达式里都会转换成指向首元素的指针。所以 int *p = a; 等价于 int *p = &a[0];。但数组名本身不是可修改的左值，a++ 非法，p++ 可以。" },
        { n: 2, title: "a[i] 就是 *(a + i)",
          text: "这是标准对下标运算符的定义，所以 a[1]、*(a + 1)、*(p + 1) 三者完全等价，都得到 20。指针加整数时，编译器会按「指向类型的大小」缩放步长：a + 1 实际移动 sizeof(int) 个字节，不是一个字节。" },
        { n: 3, title: "%td 是什么",
          text: "两个指向同一数组元素的指针相减，结果是 ptrdiff_t（定义在 <stddef.h> 的有符号整数类型），打印格式是 %td，不是 %d。p 和 a 都指向首元素，差为 0。指针相减只在同一数组内才有定义，跨不同数组相减是未定义行为。" },
      ],
      pitfalls: [
        '数组名不是可修改的左值：a++ 非法，p++ 可以。',
        'sizeof(a) 得到整个数组大小，sizeof(p) 只得到指针大小；函数参数里的数组已是指针。',
        '&a 与 a 数值相同但类型不同：&a 是"整个数组的指针"，加 1 会跨过整个数组。'
      ],
      references: [
        { source: "n1570", topic: "指针算术与下标", section: "§6.5.6" },
        { source: "n1570", topic: "数组到指针的转换", section: "§6.3.2.1p3" }
      ],
      related: ['array-1d', 'array-vs-pointer', 'sizeof-operator', 'pointer-deref']
    },

    /* ------------------------------ 复合类型 ------------------------------ */
    {
      id: 'struct-type',
      name: 'struct 结构体',
      category: '复合类型',
      aliases: ['结构体', '成员', '字段', '结构', 'struct', 'structure', 'member', '点运算符', '箭头'],
      summary: '把多个不同类型的成员打包成一个类型，成员各有独立存储空间。',
      syntax: 'struct 标签 { 类型 成员名; ... };\nstruct 标签 v;      v.成员\nstruct 标签 *p;     p->成员',
      code: `#include <stdio.h>

struct Point {
    int x;
    int y;
};

int main(void) {
    struct Point a = {1, 2};
    struct Point *p = &a;
    printf("%d %d\\n", a.x, p->y);
    return 0;
}`,
      level: 'basic',
      pitfalls: [
        '结构体变量用 . 访问，结构体指针用 ->；p->x 等价于 (*p).x，括号不能省。',
        'sizeof(struct) 可能大于各成员之和，因为存在内存对齐填充，别假设紧凑排列。',
        '结构体可以整体赋值和按值传参，但内容较大时拷贝成本高，通常传指针。'
      ],
      references: [
        { source: "n1570", topic: "结构体说明符与成员访问", section: "§6.7.2.1" },
        { source: "n1570", topic: "结构体最后一个成员的变长写法" }
      ],
      related: ['union-type', 'pass-by-value']
    },
    {
      id: 'union-type',
      name: 'union 联合体',
      category: '复合类型',
      aliases: ['联合体', '共用体', '联合', 'union', '共享内存', '成员'],
      summary: '所有成员共用同一块内存，大小由最大的成员决定，同一时刻只应使用一个成员。',
      syntax: 'union 标签 { 类型 成员1; 类型 成员2; };\nunion 标签 u;   u.成员 = 值;',
      code: `#include <stdio.h>

union Value {
    int i;
    double d;
};

int main(void) {
    union Value v;
    v.i = 7;
    printf("%d\\n", v.i);
    v.d = 3.5;              /* 写入 d 后，v.i 的值不再有意义 */
    printf("%.1f\\n", v.d);
    return 0;
}`,
      extra: [
        '与 `struct` 的对比：`struct` 各成员各有独立空间、`sizeof` 约为成员之和加填充；`union` 所有成员**共用同一块**、`sizeof` 约为最大成员加对齐。',
        '典型用途：节省内存的变体记录（配一个 `enum` 标签说明当前哪个成员有效）、按不同类型查看同一批字节。',
        '标准保证「读取最后写入的那个成员」是正确的；读别的成员涉及表示/字节序，属于实现相关。'
      ],
      level: 'basic',
      pitfalls: [
        '写入一个成员再读另一个成员，不是可靠的"类型转换"，容易踩到表示方式与字节序问题。',
        'sizeof(union) 至少等于最大成员的大小，还可能因对齐再变大。',
        '联合体里放带 nontrivial 资源（如动态内存指针）的成员，要自己记录当前哪个成员有效。'
      ],
      references: [
        { source: "n1570", topic: "联合体说明符", section: "§6.7.2.1" }
      ],
      related: ['struct-type', 'basic-types', 'enum-type']
    },

    /* ------------------------------ 内存管理 ------------------------------ */
    {
      id: 'malloc-free',
      name: 'malloc 与 free',
      category: '内存管理',
      aliases: ['动态内存', '堆', '分配', '释放', '动态分配', 'malloc', 'free', 'calloc', 'realloc', 'heap'],
      summary: '在堆上手动申请一块内存，用完必须自己归还。',
      syntax: '#include <stdlib.h>\n类型 *p = malloc(元素个数 * sizeof(类型));\n/* 使用 */\nfree(p);  p = NULL;',
      code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    /* sizeof *a 跟着 a 的类型走，以后改类型也不用改这一行 */
    int *a = malloc((size_t)n * sizeof *a);
    if (a == NULL) return 1;        /* 申请失败必须先判断，不能直接用 */
    for (int i = 0; i < n; i++) a[i] = i;
    printf("%d\\n", a[3]);
    free(a);
    a = NULL;                       /* 归还后置空，避免之后误用旧地址 */
    return 0;
}`,
      level: 'guided',
      pitfalls: [
        'malloc 可能失败返回 NULL，必须检查；不要假设一定成功。',
        '写成 sizeof *a 比 sizeof(int) 更抗改动；malloc 的参数是字节数，别漏乘 sizeof。',
        'malloc 不会清零（要清零用 calloc）；free 之后指针仍指向原地址，置 NULL 可防误用。'
      ],
      references: [
        { source: "cert-mem30", topic: "释放后指针失效", section: "MEM30-C" },
        { source: "n1570", topic: "内存管理函数", section: "§7.22.3" }
      ],
      related: ['dangling-leak', 'pointer-deref']
    },
    {
      id: 'dangling-leak',
      name: '野指针与内存泄漏',
      category: '内存管理',
      aliases: ['内存泄漏', '野指针', '悬空指针', '双重释放', '重复释放', 'leak', 'dangling', 'double free', 'use after free'],
      summary: '两类最常见的堆错误：内存没还回去，或者还回去了还在用。',
      syntax: 'free(p); p = NULL;      /* 释放后立即置空 */\n/* 每一次 malloc 都要有唯一对应的 free */',
      code: `#include <stdlib.h>

int main(void) {
    char *p = malloc(16);
    if (p == NULL) return 1;
    free(p);
    p = NULL;                /* 若不置空，p 就成了悬空指针 */
    /* free(p);  ← 再次释放 NULL 是安全的；释放非 NULL 的旧地址则出错 */
    return 0;
}`,
      level: 'basic',
      pitfalls: [
        '释放后继续读写（use after free）和重复 free 都是未定义行为，可能当时不崩、之后才出错。',
        '提前 return / break 很容易跳过 free，导致泄漏；出错分支也要记得释放。',
        'free(NULL) 是安全的（什么也不做），这是置 NULL 能兜底的原因。'
      ],
      references: [
        { source: "cert-mem30", topic: "悬空指针与重复释放", section: "MEM30-C" },
        { source: "cert-c", topic: "及时释放不再使用的内存", section: "MEM31-C" }
      ],
      related: ['malloc-free', 'pointer-deref']
    },

    /* ------------------------------ 文件 I/O ------------------------------ */
    {
      id: 'fopen-modes',
      name: 'fopen 打开模式',
      category: '文件 I/O',
      aliases: ['文件打开', '打开模式', '模式', '读写', '追加', '二进制', 'fopen', 'fclose', 'file mode', 'r w a'],
      summary: '用模式字符串决定文件是读、写、追加还是二进制方式打开。',
      syntax: '"r" 只读（文件须存在）   "w" 只写（清空/新建）\n"a" 追加                 "r+" 读写（须存在）\n"w+" 读写（清空/新建）  "a+" 读与追加\n以上加 b 表示二进制，如 "rb" "wb"',
      code: `#include <stdio.h>

int main(void) {
    FILE *f = fopen("out.txt", "w");
    if (f == NULL) return 1;
    fputs("hello\\n", f);
    fclose(f);
    return 0;
}`,
      level: 'basic',
      pitfalls: [
        '"w" 会直接清空已有文件，别拿它去"打开看看"。',
        'fopen 失败返回 NULL，一定要检查（路径、权限、磁盘都可能出问题）。',
        '每个 fopen 都要配 fclose；文本与二进制模式在 Windows 上换行处理不同。'
      ],
      references: [
        { source: "n1570", topic: "文件打开模式" },
        { source: "n1570", topic: "文本模式与二进制模式的区别" }
      ],
      related: ['fprintf-fscanf']
    },
    {
      id: 'fprintf-fscanf',
      name: 'fprintf 与 fscanf',
      category: '文件 I/O',
      aliases: ['文件读写', '格式化读写', '文件输入输出', '读文件', '写文件', 'fprintf', 'fscanf', 'printf', 'scanf', 'file io'],
      summary: '把 printf / scanf 的格式化能力用在文件流上，只是多了第一个 FILE * 参数。',
      syntax: 'fprintf(文件指针, "格式串", 参数...);\nfscanf(文件指针, "格式串", &变量...);',
      code: `#include <stdio.h>

int main(void) {
    FILE *f = fopen("num.txt", "w");
    if (f == NULL) return 1;
    fprintf(f, "%d %s\\n", 42, "answer");
    fclose(f);

    f = fopen("num.txt", "r");
    if (f == NULL) return 1;
    int n; char word[32];
    /* %31s 限制最多读 31 个字符，给结尾的 \0 留一个位置 */
    if (fscanf(f, "%d %31s", &n, word) == 2) {
        printf("%d %s\\n", n, word);
    }
    fclose(f);
    return 0;
}`,
      level: 'guided',
      pitfalls: [
        'fscanf 读变量要传地址 &n；读字符串要限制宽度（%31s），否则可能缓冲区溢出。',
        '检查 fscanf 的返回值（成功匹配的项数），不要假设一定读到了数据。',
        '格式串与参数类型必须匹配，不匹配是未定义行为；编译加 -Wall -Wextra 能查出一大部分。'
      ],
      references: [
        { source: "n1570", topic: "格式化输入输出函数" },
        { source: "n1570", topic: "格式串与变长参数类型必须匹配" }
      ],
      related: ['fopen-modes']
    },

    /* ----------------------------- 预处理与宏 ----------------------------- */
    {
      id: 'define-macro',
      name: '#define 宏定义',
      category: '预处理与宏',
      aliases: ['宏', '宏定义', '常量宏', '预处理', '替换', 'define', 'macro', 'preprocessor', '符号常量'],
      summary: '预处理阶段做纯文本替换，发生在编译之前，不占内存也没有类型。',
      syntax: '#define 名字 替换文本\n#define PI 3.14159\n#undef 名字',
      code: `#include <stdio.h>

#define PI 3.14159
#define TITLE "C quickref"

int main(void) {
    printf("%s %.5f\\n", TITLE, PI);
    return 0;
}`,
      level: 'basic',
      pitfalls: [
        '宏不是变量，没有类型检查，调试器里也看不到它的名字。',
        '行尾不要加分号：#define N 10; 会把分号一起替换进去。',
        '字符串字面量里的同名文字不会被替换；需要类型安全时优先用 const 或枚举。'
      ],
      references: [
        { source: "n1570", topic: "宏定义与宏替换" },
        { source: "cert-list", topic: "PRE31-C 避免不安全宏参数中的副作用" }
      ],
      related: ['macro-pitfall', 'include-header']
    },
    {
      id: 'macro-pitfall',
      name: '带参宏的括号坑',
      category: '预处理与宏',
      aliases: ['宏函数', '宏陷阱', '带参宏', '括号', '副作用', '多次求值', 'macro', 'function-like macro', 'pitfall'],
      summary: '宏只做文本展开，参数必须层层加括号，且带副作用的参数会被求值多次。',
      syntax: '#define 名字(参数) ((参数) 运算符 (参数))\n#define SQR(x) ((x) * (x))',
      code: `#include <stdio.h>

/* (1) 少了括号：参数会被原样展开到表达式里 */
#define BAD_SQR(x)  x * x
/* (2) 每个参数和整个表达式都加括号，才不会被优先级改写 */
#define GOOD_SQR(x) ((x) * (x))

int main(void) {
    int a = 3;
    printf("%d\\n", BAD_SQR(a + 1));   /* 展开成 a + 1 * a + 1 → 7 */
    printf("%d\\n", GOOD_SQR(a + 1));  /* → 16 */
    return 0;
}`,
      level: 'detailed',
      walkthrough: [
        { n: 1, title: "BAD_SQR(a + 1) 为什么得到 7",
          text: "宏是预处理阶段的纯文本替换，不按函数调用那样先算参数。BAD_SQR(a + 1) 被展开成 a + 1 * a + 1，代入 a=3 就是 3 + 1*3 + 1 = 7。乘法优先于加法，含义已经被悄悄改掉了。" },
        { n: 2, title: "GOOD_SQR 的两层括号各管什么",
          text: "每个参数外面的括号 (x) 保证参数作为整体参与运算；最外层 ((x) * (x)) 保证整个宏结果在嵌入更大表达式时仍是一个整体。但括号也救不了一切：GOOD_SQR(i++) 会展开成 ((i++) * (i++))，i 被加两次——带 ++、-- 或函数调用的参数不要传给宏，这正是宏与函数的本质差别。" },
      ],
      pitfalls: [
        '整个表达式和每个参数都要加括号，否则运算符优先级会改变含义。',
        'GOOD_SQR(i++) 会把 i 加两次；不要给宏传带 ++ / -- / 函数调用的参数。',
        '多行宏要用 do { ... } while (0) 包起来，才能安全地放进 if 里。'
      ],
      references: [
        { source: "gcc-stmt-expr", topic: "让宏只求值一次的语句表达式（GNU 扩展）", section: "§6.12.1" },
        { source: "gcc-typeof", topic: "配合 typeof 写类型通用宏（GNU 扩展）", section: "§6.12.5" },
        { source: "cert-list", topic: "PRE31-C 避免宏参数副作用" }
      ],
      related: ['define-macro', 'operator-precedence']
    },

    {
      id: "bool-stdbool",
      name: "_Bool 与 <stdbool.h>",
      category: "数据类型",
      aliases: ["布尔", "bool", "_Bool", "stdbool", "true", "false", "布尔类型"],
      summary: "C99 起有 _Bool；包含 <stdbool.h> 后可写 bool / true / false。",
      syntax: "#include <stdbool.h>\nbool flag = true;",
      code: `#include <stdio.h>
#include <stdbool.h>

int main(void) {
    bool done = false;
    int x = 7;
    /* 任何非零值转成 _Bool 都是 1，0 转成 0 */
    done = x;
    printf("%d %d\\n", done, true);
    return 0;
}`,
      level: "guided",
      extra: [
        "`_Bool` 是 C99 引入的关键字；`<stdbool.h>` 只是把 `bool` 定义成 `_Bool`、`true` 定义成 1、`false` 定义成 0 的宏。",
        "把标量赋给 `_Bool` 时规则特殊：值为 0 得 0，否则得 1 —— 不是「截断低位」，这和转成 `int` 不同。",
        "C23 起 `bool` / `true` / `false` 成为关键字，`<stdbool.h>` 逐渐不再必要。"
      ],
      pitfalls: [
        "不包含 <stdbool.h> 就写 bool，在 C99/C11 里会编译失败（C23 之前）。",
        "别把 _Bool 当整数用：`(_Bool)2` 得到 1，不是 2。",
        "sizeof(_Bool) 通常是 1，但标准只规定它能存 0 和 1，不规定字节数。"
      ],
      references: [
        { source: "n1570", topic: "布尔类型与 <stdbool.h>" },
        { source: "cppref-generic", topic: "C11 起的语言特性索引" }
      ],
      related: ["basic-types", "implicit-conversion"]
    },

    {
      id: "stdint-fixed-width",
      name: "固定宽度整数 int32_t",
      category: "数据类型",
      aliases: ["int32_t", "uint32_t", "stdint", "固定宽度", "定长整数", "int64_t", "PRIu32"],
      summary: "需要确定字节数时用 <stdint.h> 的 int32_t / uint64_t 等类型。",
      syntax: "#include <stdint.h>\n#include <inttypes.h>\nint32_t a = 100;",
      code: `#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>

int main(void) {
    /* (1) 明确 32 位有符号，不依赖平台上的 int / long 宽度 */
    int32_t a = -100;
    uint64_t b = 4000000000ULL;
    /* (2) 打印固定宽度类型要用 inttypes.h 的 PRI 宏拼接格式串 */
    printf("%" PRId32 " %" PRIu64 "\\n", a, b);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "为什么不用 int / long",
          text: "C 只保证 short ≤ int ≤ long ≤ long long 的相对大小，不规定具体位数：64 位 Linux 上 long 是 8 字节，64 位 Windows 上仍是 4 字节。写文件格式、网络协议、跨语言结构体时，这种差异会让数据错位，所以改用 <stdint.h> 里明确位数的 int32_t / uint64_t。" },
        { n: 2, title: "PRId32 / PRIu64 是什么",
          text: "printf 的格式串必须和实参类型严格对应，但 int32_t 在某些平台是 int、另一些平台是 long，写死 %d 或 %ld 都不通用。<inttypes.h> 提供的 PRId32、PRIu64 等宏会展开成当前平台正确的格式字符；因为它们是字符串字面量，可以靠 C 的相邻字符串拼接写进格式串，如 \"%\" PRId32 \"\\n\"。" }
      ],
      extra: [
        "`intN_t` 只在实现「恰好提供 N 位、无填充、二进制补码」的类型时才存在；`int_leastN_t` / `int_fastN_t` 则保证存在。",
        "指针与整数互转可用 `intptr_t` / `uintptr_t`，但并非所有实现都提供。",
        "`<stdint.h>` 还提供 `INT32_MIN` / `UINT64_MAX` 这类边界宏，比自己背数字可靠。"
      ],
      pitfalls: [
        "别对 int32_t 写死 %d；不同平台 typedef 到的底层类型可能不同，要用 PRI 宏。",
        "固定宽度类型是可选的：某些嵌入式实现没有精确的 32 位类型，int32_t 就不存在。",
        "别把 int32_t 与「一定是 4 字节对齐」混为一谈，对齐由实现决定。"
      ],
      references: [
        { source: "n1570", topic: "固定宽度整数类型 <stdint.h>" },
        { source: "cert-list", topic: "INT35-C 使用正确的整数精度" }
      ],
      related: ["integer-types-compared", "signed-unsigned", "typedef-alias"]
    },

    {
      id: "generic-selection",
      name: "_Generic 泛型选择",
      category: "数据类型",
      aliases: ["_Generic", "泛型", "泛型选择", "generic", "类型分发", "tgmath"],
      summary: "C11 起按控制表达式的「类型」在编译期选一个表达式。",
      syntax: "_Generic(控制表达式, int: 表达式, double: 表达式, default: 表达式)",
      code: `#include <stdio.h>

/* (1) 按实参类型选不同的函数名，模拟「类型重载」 */
#define type_name(x) _Generic((x), \\
    int: "int", double: "double", default: "other")

int main(void) {
    /* (2) 字符串字面量经左值转换后类型是 char*，不是 char 数组 */
    printf("%s %s %s\\n", type_name(1), type_name(2.0), type_name("hi"));
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "选择发生在编译期，且只求值被选中的分支",
          text: "_Generic 拿控制表达式的类型去和关联列表里的类型名比较，命中的那个表达式才成为整个泛型选择的类型与值。控制表达式本身以及未被选中的分支都不会被求值，所以可以在分支里写有副作用的表达式而不必担心误触发。没有 default 且无一类型兼容时，程序无法通过编译。" },
        { n: 2, title: "为什么 \"hi\" 走 default",
          text: "C11 之后的 DR 481 明确规定：控制表达式的类型要先做「类型域内的左值转换」——丢弃顶层 const/volatile/原子限定，并把数组转指针、函数转指针，但不产生任何实际求值。所以字符串字面量 \"hi\"（类型 char[3]）会转成 char* 去匹配；本例没写 char* 关联，于是落到 default。同理 (const int){0} 匹配的是 int 而不是 const int。" }
      ],
      extra: [
        "标准依据：C11 §6.5.1.1（C17 同号，页码 56-57）；DR 481 追溯修正了控制表达式的左值转换。",
        "最初用途之一是为 `<tgmath.h>` 的类型泛型数学宏提供标准实现手段。",
        "关联列表里任意两个类型名不能是兼容类型，`default` 最多一个。"
      ],
      pitfalls: [
        "这是 C11 特性，用 -std=c99 编译会报错。",
        "别指望运行时分发：所有分支都参与类型检查，只是不参与求值。",
        "数组 / 函数类型会先退化成指针，写 char[4] 这样的关联永远匹配不上。"
      ],
      references: [
        { source: "cppref-generic", topic: "泛型选择语法、左值转换与 DR 481", section: "C11 §6.5.1.1" },
        { source: "n1570", topic: "泛型选择" }
      ],
      related: ["basic-types", "implicit-conversion", "define-macro"]
    },

    {
      id: "volatile-qualifier",
      name: "volatile 限定符",
      category: "变量与常量",
      aliases: ["volatile", "易变", "不优化", "寄存器", "内存映射"],
      summary: "告诉编译器这个对象可能被程序之外改变，每次都要真的读写内存。",
      syntax: "volatile int flag;\nvolatile uint32_t *reg = (volatile uint32_t *)0x4000;",
      code: `#include <stdio.h>

int main(void) {
    volatile int ticks = 0;
    /* 每次都从内存读，编译器不能把这个循环优化成「直接用常量」 */
    while (ticks < 3) {
        ticks = ticks + 1;
        printf("%d ", ticks);
    }
    printf("\\n");
    return 0;
}`,
      level: "guided",
      extra: [
        "典型用途：内存映射的硬件寄存器、被信号处理函数修改的全局标志、与 `setjmp` / `longjmp` 配合的局部变量。",
        "`volatile` **不是**线程同步手段：它不提供原子性、不建立内存屏障、不阻止指令重排。多线程共享数据要用 `<stdatomic.h>` 或互斥量。",
        "CERT C EXP32-C 专门讲「不要通过非 volatile 引用访问 volatile 对象」。"
      ],
      pitfalls: [
        "volatile 不能替代原子类型或锁，用它做线程间通信是常见误解。",
        "volatile 只影响对该对象的访问，不会被「传染」到别的变量。",
        "在严格一致的程序里，通过非 volatile 指针访问 volatile 对象是未定义行为。"
      ],
      references: [
        { source: "n1570", topic: "类型限定符 volatile 的语义" },
        { source: "cert-list", topic: "EXP32-C 不要通过非 volatile 引用访问 volatile 对象" }
      ],
      related: ["const-qualifier", "static-local-global"]
    },

    {
      id: "restrict-qualifier",
      name: "restrict 限定符",
      category: "变量与常量",
      aliases: ["restrict", "无别名", "别名优化", "__restrict"],
      summary: "C99 起向编译器承诺：该指针是访问这块对象的唯一途径，便于优化。",
      syntax: "void copy(int *restrict dst, const int *restrict src, size_t n);",
      code: `#include <stdio.h>
#include <stddef.h>

/* (1) 承诺 dst 与 src 不重叠，编译器才能放心重排读写 */
void add_arrays(int *restrict dst, const int *restrict src, size_t n) {
    for (size_t i = 0; i < n; i++) dst[i] += src[i];
}

int main(void) {
    int a[3] = {1, 2, 3}, b[3] = {10, 20, 30};
    add_arrays(a, b, 3);
    printf("%d %d %d\\n", a[0], a[1], a[2]);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "restrict 是给编译器的承诺，不是给编译器的检查",
          text: "restrict 表示：在该指针的作用域内，它所指向的对象只能通过这个指针（或由它派生的指针）访问。编译器因此不必担心 dst 与 src 指向同一块内存，可以大胆把多次加载合并、把循环向量化。但如果调用时真的传了重叠的区间，就违反了这个承诺，行为是未定义的——编译器不会帮你报错，结果可能静默出错。" }
      ],
      extra: [
        "库函数里 `memcpy` 的两个指针带 restrict 语义，所以区间重叠时必须改用 `memmove`；这正是两者最关键的区别。",
        "CERT C EXP43-C 讲「使用 restrict 限定指针时避免未定义行为」。",
        "C++ 没有标准 restrict，各编译器用 `__restrict` / `__restrict__` 作为扩展。"
      ],
      pitfalls: [
        "传重叠区间给带 restrict 的参数是未定义行为，不会有任何编译警告。",
        "restrict 只对指针类型有意义，且作用于「该指针的块作用域」。",
        "别为了「优化」随手加 restrict：承诺错了比不优化更危险。"
      ],
      references: [
        { source: "n1570", topic: "restrict 限定指针的语义" },
        { source: "cert-list", topic: "EXP43-C 使用 restrict 时避免未定义行为" }
      ],
      related: ["memcpy-memmove", "pointer-deref"]
    },

    {
      id: "logical-short-circuit",
      name: "&& 与 || 的短路求值",
      category: "运算符",
      aliases: ["短路", "短路求值", "&&", "||", "逻辑与", "逻辑或", "序列点"],
      summary: "&& 左边为假就不算右边；|| 左边为真就不算右边，且左式先于右式求值。",
      syntax: "if (p != NULL && *p > 0) { ... }",
      code: `#include <stdio.h>

int main(void) {
    int x = 0, calls = 0;
    /* (1) 左边 x != 0 为假，右边根本不会执行，calls 仍是 0 */
    if (x != 0 && ++calls > 0) { printf("不会走到\\n"); }
    printf("calls=%d\\n", calls);
    /* (2) 先判指针再解引用，靠的就是这个「保证的求值顺序」 */
    int *p = NULL;
    if (p != NULL && *p == 1) { printf("安全\\n"); }
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "短路到底保证了什么",
          text: "&& 和 || 是 C 里少数明确规定了求值顺序的运算符：左操作数先求值，且左侧结果已能决定整体结果时，右操作数完全不求值。所以 ++calls 没有发生。相比之下，大多数运算符（如 +、*、函数调用的参数）都不规定子表达式的求值先后，C11 §6.5p3 说的是「副作用与子表达式的值计算是无顺序的（unsequenced）」。" },
        { n: 2, title: "为什么能安全地写 p != NULL && *p",
          text: "因为 && 的左式一定先算完（中间有序列点），只有 p 非空才会去解引用。这种「守卫式」写法在 C 里是惯用法。但注意别把 && 写成 &：按位与 & 两边都会求值，没有短路，也会把指针解引用成数值位运算。" }
      ],
      extra: [
        "标准依据：C11 §6.5p3（子表达式求值无顺序）与 §6.5.13 / §6.5.14（逻辑运算符的短路与序列点）；§6.5p3 的原文已核对。",
        "三元运算符 `?:`、逗号运算符 `,`、函数调用的 `()` 也各自有规定的求值顺序，不要与「一般运算符无顺序」混淆。",
        "`&` 与 `&&`、`|` 与 `||` 只差一个字符，含义完全不同；CERT C EXP46-C 专门提醒别把位运算符用在布尔式操作数上。"
      ],
      pitfalls: [
        "别依赖 f() + g() 的调用先后，一般运算符不规定求值顺序。",
        "把 && 写成 & 会失去短路，守卫指针的写法立刻变成解引用空指针。",
        "右操作数的副作用（如 ++）不会被保证发生，不要把它当作「一定会执行」的逻辑。"
      ],
      references: [
        { source: "n1570", topic: "表达式的求值顺序与副作用", section: "§6.5p3" },
        { source: "cert-list", topic: "EXP30-C 不要依赖副作用的求值顺序；EXP46-C 布尔式不要用位运算符" }
      ],
      related: ["operator-precedence", "bitwise-operators", "if-else"]
    },

    {
      id: "shift-operators",
      name: "左移与右移 << >>",
      category: "运算符",
      aliases: ["移位", "左移", "右移", "<<", ">>", "shift", "算术右移"],
      summary: "<< 乘 2 的幂、>> 除 2 的幂，但只对无符号或非负有符号值才是这个语义。",
      syntax: "unsigned int mask = 1u << n;",
      code: `#include <stdio.h>

int main(void) {
    unsigned int x = 8u;
    printf("%u %u %u\\n", x << 2, x >> 2, 1u << 4);
    /* 右移负数由实现定义；用无符号数做位运算最稳妥 */
    unsigned int y = 0xF0u;
    printf("%u\\n", (y >> 4) & 0x0Fu);
    return 0;
}`,
      level: "guided",
      extra: [
        "移位位数必须是非负且**小于**左操作数的位数，否则是未定义行为；CERT C INT34-C 就是这条规则。",
        "负数右移是「实现定义」：多数编译器做算术右移（符号位扩展），但标准不保证。",
        "用 `1u << k` 而不是 `1 << k`：后者在 k 到达符号位时属于有符号左移溢出，风险更高。"
      ],
      pitfalls: [
        "`1 << 31` 在 32 位 int 上是未定义行为，要写 `1u << 31`。",
        "移位位数等于或超过类型宽度（如 `x >> 32`）是未定义行为，不是「结果为 0」。",
        "别用有符号负数做右移并假定结果，那是实现定义行为。"
      ],
      references: [
        { source: "cert-list", topic: "INT34-C 不要用负数或超出位数的位移量" },
        { source: "cert-int", topic: "整数运算的溢出与转换规则", section: "INT32-C / INT34-C" }
      ],
      related: ["bitwise-operators", "operator-precedence"]
    },

    {
      id: "increment-decrement",
      name: "++ 与 -- 的前置/后置",
      category: "运算符",
      aliases: ["自增", "自减", "++", "--", "i++", "++i", "前置自增", "后置自增"],
      summary: "前置先加再用，后置先用再加；别在同一个表达式里多次改同一个变量。",
      syntax: "++i;   // 先加再用\ni++;   // 先用再加",
      code: `#include <stdio.h>

int main(void) {
    int i = 1, j = 1;
    printf("%d %d\\n", ++i, j++);
    printf("%d %d\\n", i, j);
    return 0;
}`,
      level: "basic",
      extra: [
        "`++i` 等价于 `i += 1`，表达式的值是**加之后**的值；`i++` 的值是**加之前**的值。",
        "在 C 里 `i++` 的结果不是左值（C++ 里前置 `++i` 是左值），所以 `(i++) = 3` 非法。",
        "单独作为一条语句用时，`i++` 与 `++i` 效果相同；在 C++ 的迭代器上前置通常更省，但那是 C++ 的话题。"
      ],
      pitfalls: [
        "`i = i++ + 1`、`printf(\"%d %d\", i++, i++)` 这类在同一表达式里多次修改同一对象，求值无顺序，结果不确定。",
        "`a[i] = i++` 同样危险：C11 §6.5.16p3 明确赋值两侧操作数的求值是无顺序的。",
        "后置 ++ 需要保存旧值，语义上比前置多一次「取旧值」，但别为微优化牺牲可读性。"
      ],
      references: [
        { source: "n1570", topic: "赋值运算符两侧求值无顺序", section: "§6.5.16p3" },
        { source: "cert-list", topic: "EXP30-C 不要依赖副作用的求值顺序" }
      ],
      related: ["arithmetic-assignment", "operator-precedence"]
    },

    {
      id: "conditional-operator",
      name: "?: 条件运算符",
      category: "运算符",
      aliases: ["三元", "三目", "条件运算符", "?:", "ternary"],
      summary: "C 里唯一的三目运算符：条件为真取第二式，否则取第三式。",
      syntax: "结果 = 条件 ? 表达式1 : 表达式2;",
      code: `#include <stdio.h>

int main(void) {
    int a = 5, b = 3;
    int m = a > b ? a : b;
    /* 只会有被选中的那一支被求值 */
    printf("%d %d\\n", m, a > b ? a * 2 : b * 2);
    return 0;
}`,
      level: "guided",
      extra: [
        "结合性是从右往左：`a ? b : c ? d : e` 等价于 `a ? b : (c ? d : e)`。",
        "第二、三操作数会做「寻常算术转换」以得到共同类型；一边是指针一边是 0 时按空指针常量处理。",
        "C 里条件运算符的结果**不是左值**；`(x ? a : b) = 3` 非法（C++ 里可以）。"
      ],
      pitfalls: [
        "别写嵌套三目，超过一层就该换成 if-else，可读性下降很快。",
        "两个分支类型不同时会发生隐式转换，可能丢精度，例如 `flag ? 1 : 2.5` 结果是 double。",
        "优先级低于大多数运算符，`x ? a : b + 1` 的括号位置要看清。"
      ],
      references: [
        { source: "n1570", topic: "条件运算符与求值顺序" },
        { source: "cppref-generic", topic: "C 表达式与运算符索引" }
      ],
      related: ["if-else", "implicit-conversion", "operator-precedence"]
    },

    {
      id: "goto-label",
      name: "goto 与标号",
      category: "控制结构",
      aliases: ["goto", "标号", "label", "跳转", "统一出口", "cleanup"],
      summary: "函数内跳转；现代 C 里主要用于错误处理的统一清理出口。",
      syntax: "goto cleanup;\n...\ncleanup:\n    free(p);",
      code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *a = malloc(sizeof *a);
    if (a == NULL) goto cleanup;   /* 失败时统一跳到清理段 */

    *a = 42;
    printf("%d\\n", *a);

cleanup:
    free(a);
    return 0;
}`,
      level: "guided",
      extra: [
        "`goto` 只能在**同一个函数内**跳转，不能跨函数；跨函数跳转要用 `setjmp` / `longjmp`。",
        "标号是函数作用域的，不受块限制；但不能用 goto 跳进一个跳过了变量初始化（尤其是 VLA）的块。",
        "内核与系统代码里常见的「单出口清理」模式：每个失败点 goto 到同一个 cleanup 标签，避免重复写 free / fclose。"
      ],
      pitfalls: [
        "goto 不能跳过变长数组（VLA）的声明进入其作用域，这属于约束违反。",
        "别用 goto 往回跳构造循环，for / while 更清晰也更易优化。",
        "标号名与变量名不在同一命名空间，但重名仍会让读代码的人困惑。"
      ],
      references: [
        { source: "n1570", topic: "跳转语句与标号" },
        { source: "gcc-stmt-expr", topic: "语句表达式中禁止 goto 跳入（GCC 扩展的相关限制）", section: "§6.12.1" }
      ],
      related: ["malloc-free", "break-continue", "variable-scope"]
    },

    {
      id: "function-pointer",
      name: "函数指针",
      category: "函数",
      aliases: ["函数指针", "回调", "callback", "qsort", "指针函数"],
      summary: "指向函数的指针，可用来做回调、分发表和策略选择。",
      syntax: "返回类型 (*指针名)(参数类型列表);",
      code: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

/* (1) 参数是「指向函数的指针」，调用时由调用方决定用哪个实现 */
int apply(int (*op)(int, int), int x, int y) { return op(x, y); }

int main(void) {
    printf("%d %d\\n", apply(add, 3, 2), apply(sub, 3, 2));
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "int (*op)(int, int) 怎么读",
          text: "括号不能省：`int (*op)(int,int)` 是「op 是指针，指向一个接收两个 int、返回 int 的函数」；而 `int *op(int,int)` 是「op 是函数，返回一个 int*」，完全不同。读声明的口诀是从标识符往外看：先遇到 * 是指针，再遇到 (...) 是函数。函数名在表达式里会自动转换成指向该函数的指针，所以 apply(add, ...) 不需要写 &add（写 &add 也对）。" }
      ],
      extra: [
        "标准里「函数指示符」在大多数表达式上下文中会转换为指向该函数的指针，与数组名退化成指针是同类规则。",
        "函数指针之间不能用 `>` `<` 比较，也不能做指针算术；只能判等或转成布尔判断。",
        "`qsort` / `bsearch` 的比较函数、`signal` 的处理器都是标准库里函数指针的典型用法。"
      ],
      pitfalls: [
        "`int *f(void)` 是返回指针的函数，不是函数指针；括号位置是最高频错误。",
        "不同类型（参数/返回值不同）的函数指针不能混用，强转后调用是未定义行为。",
        "别把数据指针与函数指针互相转换，标准不保证两者表示兼容。"
      ],
      references: [
        { source: "n1570", topic: "函数指示符与函数指针声明" },
        { source: "cert-list", topic: "EXP37-C 用正确的参数个数与类型调用函数" }
      ],
      related: ["function-prototype", "pass-by-value", "pointer-deref"]
    },

    {
      id: "variadic-functions",
      name: "变长参数 va_list",
      category: "函数",
      aliases: ["变长参数", "可变参数", "va_list", "va_start", "va_arg", "stdarg", "省略号"],
      summary: "用 <stdarg.h> 让函数接收数量不定的参数，如自己实现一个 sum。",
      syntax: "int sum(int count, ...);",
      code: `#include <stdio.h>
#include <stdarg.h>

/* (1) 必须至少有一个具名参数，va_start 靠它定位 */
int sum(int count, ...) {
    va_list ap;
    va_start(ap, count);
    int total = 0;
    /* (2) 参数类型得自己约定：默认实参提升后 char→int、float→double */
    for (int i = 0; i < count; i++) total += va_arg(ap, int);
    va_end(ap);
    return total;
}

int main(void) {
    printf("%d\\n", sum(3, 10, 20, 30));
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "为什么必须有具名参数",
          text: "va_start 的第二个参数是「最后一个具名参数」，宏要靠它的位置找到变长参数区的起点。声明成 f(...)（完全没有具名参数）在 C11 里是不合法的。另外，具名参数不能是 register、函数类型或数组类型，因为这些会发生特殊调整。" },
        { n: 2, title: "默认实参提升是最容易踩的坑",
          text: "变长参数在传递时会做默认实参提升：char / short 提升成 int，float 提升成 double。因此 va_arg(ap, float) 永远不对，要写 va_arg(ap, double)；写 char 也要写 int 再自己转回来。va_arg 取的类型与实际类型不一致时行为未定义，而编译器无法帮你检查——这正是 printf 格式串写错会崩的原因。" }
      ],
      extra: [
        "使用顺序固定：`va_list ap;` → `va_start(ap, last);` → 若干 `va_arg(ap, T);` → `va_end(ap);`。",
        "可用 `va_copy` 复制一份 va_list 以便遍历两次；复制出来的副本也要 `va_end`。",
        "CERT C EXP47-C 专门讲「不要用错误类型调用 va_arg」。"
      ],
      pitfalls: [
        "`va_arg(ap, float)` 是错的，float 已被提升成 double。",
        "没有自带参数个数信息，调用方必须自己传 count 或以哨兵值（如 NULL）结尾。",
        "同一个 va_list 用完必须 va_end；跨函数传递 va_list 要用 va_copy。"
      ],
      references: [
        { source: "n1570", topic: "变长参数与 <stdarg.h>" },
        { source: "cert-list", topic: "EXP47-C 不要用错误类型调用 va_arg" }
      ],
      related: ["function-prototype", "implicit-conversion", "fprintf-fscanf"]
    },

    {
      id: "multidim-array",
      name: "二维数组与行指针",
      category: "数组与字符串",
      aliases: ["二维数组", "多维数组", "行指针", "matrix", "a[i][j]", "数组指针"],
      summary: "int a[2][3] 是「2 个含 3 个 int 的数组」，传参时第二维不能省。",
      syntax: "int a[2][3];\nvoid f(int a[][3], int rows);",
      code: `#include <stdio.h>

/* (1) 只有第一维能退化成指针，第二维 3 必须写死 */
void show(int a[][3], int rows) {
    for (int i = 0; i < rows; i++)
        printf("%d %d %d\\n", a[i][0], a[i][1], a[i][2]);
}

int main(void) {
    int a[2][3] = {{1, 2, 3}, {4, 5, 6}};
    show(a, 2);
    printf("一行 %zu 字节\\n", sizeof(a[0]));
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "为什么 void f(int a[][3]) 里的 3 不能省",
          text: "函数参数里的数组会按 §6.7.6.3p7 调整为指针：int a[][3] 实际是「指向含 3 个 int 的数组的指针」int (*a)[3]。编译器要靠这个 3 计算 a[i] 该跨过多少字节（a + i 一次移动 3*sizeof(int)）。少写第二维，编译器就不知道一行的长度，a[i][j] 无法定位。第一维之所以能省，正是因为它已经退化成指针、不再携带长度信息——所以行数要另传一个 rows 参数。" }
      ],
      extra: [
        "内存是连续的：`a[i][j]` 等价于 `*(*(a + i) + j)`；`&a[0][0]` 与 `a[0]` 数值相同但类型不同。",
        "`sizeof(a)` 是整个二维数组，`sizeof(a[0])` 是一行，`sizeof(a[0][0])` 是一个元素。",
        "`int *p[3]` 是「3 个指针的数组」，`int (*p)[3]` 是「指向含 3 个 int 的数组的指针」，括号决定含义。"
      ],
      pitfalls: [
        "别把二维数组当 `int **` 传：两者内存布局与步长算法都不同，强转后访问会读错数据。",
        "第二维必须与实参一致，写成 `[][4]` 而实参是 `[2][3]` 会静默错位。",
        "C99 起可用 VLA 参数 `void f(int rows, int cols, int a[rows][cols])`，但要确保编译器支持。"
      ],
      references: [
        { source: "n1570", topic: "函数参数的数组到指针调整", section: "§6.7.6.3p7" },
        { source: "n1570", topic: "数组下标与指针运算", section: "§6.5.6" }
      ],
      related: ["array-1d", "array-vs-pointer", "pointer-array"]
    },

    {
      id: "string-functions",
      name: "strlen / strcpy / strncpy",
      category: "数组与字符串",
      aliases: ["strlen", "strcpy", "strncpy", "strcat", "字符串函数", "string.h"],
      summary: "<string.h> 的常用字符串操作；strncpy 不保证补 \\0，是最常见的坑。",
      syntax: "#include <string.h>\nsize_t n = strlen(s);\nstrcpy(dst, src);",
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char src[] = "hello";
    char dst[16];
    strcpy(dst, src);
    printf("%zu %s\\n", strlen(dst), dst);
    /* strncat 会自己补 \\0，比 strncpy 更适合「限量追加」 */
    strncat(dst, "!", sizeof(dst) - strlen(dst) - 1);
    printf("%s\\n", dst);
    return 0;
}`,
      level: "guided",
      extra: [
        "`strlen` 返回 `size_t`（无符号），打印用 `%zu`；它数到第一个 `\\0` 为止，不检查缓冲区真实大小。",
        "`strncpy(dst, src, n)` 在 src 长度 ≥ n 时**不会**在末尾补 `\\0`，结果可能不是合法字符串；很多代码因此改用手写补零或 `snprintf`。",
        "`memcpy` 与 `strcpy` 不同：前者按字节数复制、遇 `\\0` 不停；后者按字符串复制到 `\\0` 为止。"
      ],
      pitfalls: [
        "目标缓冲区必须足够大（含结尾 \\0），strcpy 不做任何边界检查。",
        "strncpy 不保证以 \\0 结尾，复制后要手动 `dst[n-1] = '\\0'`。",
        "别把 strlen 的结果直接和负数比较：size_t 是无符号，会先把负数转成很大的正数。"
      ],
      references: [
        { source: "n1570", topic: "字符串库 <string.h>" },
        { source: "cert-c", topic: "STR 章节：字符与字符串相关规则" }
      ],
      related: ["string-null-terminator", "memcpy-memmove", "signed-unsigned"]
    },

    {
      id: "pointer-to-pointer",
      name: "二级指针 int **",
      category: "指针",
      aliases: ["二级指针", "int **", "指针的指针", "char **", "argv", "双重指针"],
      summary: "指向指针的指针；常用于「让函数修改调用者的指针」或指针数组。",
      syntax: "void alloc(int **out) { *out = malloc(...); }",
      code: `#include <stdio.h>
#include <stdlib.h>

/* (1) 想改外面的指针变量本身，就要传它的地址 */
void make(int **out) { *out = malloc(sizeof **out); }

int main(void) {
    int *p = NULL;
    make(&p);
    if (p == NULL) return 1;
    **&p = 7;                 /* 等价于 *p = 7 */
    printf("%d\\n", *p);
    free(p);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "为什么要 int ** 而不是 int *",
          text: "C 的参数按值传递：传 int* 进函数，函数拿到的是这份地址的副本，改它（让它指向新地址）不会影响调用者。要让函数「分配内存并把新地址交回去」，就得传「指针变量的地址」，也就是 int **；函数里 *out = malloc(...) 写的是调用者那个指针变量本身。另一种更可读的做法是让函数返回新指针：int *make(void) { return malloc(...); }。" }
      ],
      extra: [
        "`char *argv[]` 作为函数参数时等价于 `char **argv`（§6.7.6.3p7）；但 `char *a[3]` 作为**变量声明**是「3 个指针的数组」，不是二级指针。",
        "区分三个写法：`int **pp`（指向指针的指针）、`int *p[3]`（指针数组）、`int (*p)[3]`（指向数组的指针）。",
        "二级指针不等于二维数组，不能用 `pp[i][j]` 去访问一个连续的 int a[2][3]。"
      ],
      pitfalls: [
        "`int **` 不能直接接收 `int a[2][3]`；二维数组退化成的是 `int (*)[3]`。",
        "每一层都要检查 NULL：`pp` 非空不代表 `*pp` 非空。",
        "别让函数返回指向局部变量的地址，二级指针同样会悬空。"
      ],
      references: [
        { source: "n1570", topic: "指针类型与函数参数调整", section: "§6.7.6.3p7" },
        { source: "n1570", topic: "数组到指针的转换", section: "§6.3.2.1p3" }
      ],
      related: ["pointer-deref", "pass-by-value", "multidim-array"]
    },

    {
      id: "const-and-pointer",
      name: "const 与指针的三种位置",
      category: "指针",
      aliases: ["const 指针", "指针常量", "常量指针", "const int *", "int * const", "顶层 const"],
      summary: "const 在 * 左边还是右边，决定「不能改的是数据还是指针」。",
      syntax: "const int *p;        // 数据只读\nint * const p = &x;  // 指针只读\nconst int * const p = &x;",
      code: `#include <stdio.h>

/* (1) 只读指针：函数承诺不改动传入的数据 */
void print_all(const int *a, int n) {
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\\n");
}

int main(void) {
    int x = 1, y = 2;
    const int *p = &x;
    p = &y;            /* 可以改指向 */
    /* *p = 9;  ← 非法：被指向的数据只读 */
    print_all(&x, 1);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "从标识符往左读",
          text: "`const int *p` 里 const 修饰的是 *p（被指向的 int），所以数据只读、p 本身可以改指向；`int * const p` 里 const 修饰 p，所以指针本身不能再指向别处、数据仍可改。写成 `const int *` 与 `int const *` 是同一回事。给函数参数加 const int * 是很有价值的接口约定：调用方一眼知道这份数据不会被修改，也能安全传入字面量数组或 const 对象。" }
      ],
      extra: [
        "把 `const int *` 强转成 `int *` 再去写，若原对象本身是 const，属于未定义行为；CERT C EXP40-C 就是这条。",
        "`const int *` 不等于「数据永远不会变」：别的非 const 指针仍可能改它，const 只是通过这个指针的限制。",
        "字符串字面量的类型是 `char[N]` 但修改它未定义，所以指向它的指针应写 `const char *`。"
      ],
      pitfalls: [
        "`const char *p` 不能写 `*p = ...`，但字符串字面量赋给 `char *` 在某些编译器只给警告。",
        "别为了「去掉 const 警告」随手强转，先确认对象本身是否真的可写。",
        "`typedef int *P; const P p;` 的 const 修饰的是**指针**，不是 int —— typedef 会改变读法。"
      ],
      references: [
        { source: "n1570", topic: "类型限定符 const" },
        { source: "cert-list", topic: "EXP40-C 不要修改常量对象" }
      ],
      related: ["const-qualifier", "pass-by-value", "pointer-deref"]
    },

    {
      id: "bit-field",
      name: "位域 bit-field",
      category: "复合类型",
      aliases: ["位域", "位段", "bit field", "位字段", "冒号宽度"],
      summary: "在 struct 里按位分配成员宽度，常用于标志位与硬件寄存器布局。",
      syntax: "struct Flags { unsigned int ready : 1; unsigned int mode : 3; };",
      code: `#include <stdio.h>

/* (1) 位域的顺序与打包方式由实现定义，别用它猜测内存布局 */
struct Flags {
    unsigned int ready : 1;
    unsigned int mode  : 3;
};

int main(void) {
    struct Flags f = {0};
    f.ready = 1;
    f.mode  = 5;      /* 3 位能表示 0..7 */
    printf("%u %u %zu\\n", f.ready, f.mode, sizeof(f));
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "位域的「实现定义」多到什么程度",
          text: "C11 §6.7.2.1 规定：位域宽度必须是非负整数常量表达式且不超过底层类型宽度；实现可以选任意足够大的可寻址存储单元来放位域；放不下时是放进下一个单元还是跨单元重叠、位在单元里从高位还是低位排，都是实现定义的；单元的对齐也未指定。C99 勘误 2 修订过这段宽度约束的文字。想写跨平台的协议/寄存器布局，用固定宽度整数加显式移位掩码更可靠。" }
      ],
      extra: [
        "标准依据：C11 §6.7.2.1（位域）；C99 技术勘误 2 修订了「宽度不得超过省略冒号时类型的宽度」这一句。",
        "位域**没有地址**，不能对它用 `&`，也不能建指针数组；无名位域（如 `unsigned int : 3;`）用来占位对齐。",
        "用 `signed int` / `unsigned int` 之外的类型做位域是实现定义的；`_Bool` 位域宽度通常只写 1。"
      ],
      pitfalls: [
        "不能对位域取地址，`scanf(\"%d\", &f.mode)` 直接编译失败，要先读到临时变量。",
        "位域的排列顺序、跨单元行为是实现定义的，别假定内存里的 bit 顺序。",
        "赋值超出位宽会被截断（无符号按模），5 存进 2 位变 1，编译器不一定警告。"
      ],
      references: [
        { source: "n1570", topic: "结构体与联合体说明符中的位域", section: "§6.7.2.1" },
        { source: "c99-cor2", topic: "位域宽度约束与柔性数组成员段落修订", section: "§6.7.2.1" }
      ],
      related: ["struct-type", "bitwise-operators", "stdint-fixed-width"]
    },

    {
      id: "flexible-array-member",
      name: "柔性数组成员",
      category: "复合类型",
      aliases: ["柔性数组", "柔性数组成员", "flexible array", "FAM", "不定长数组", "struct hack"],
      summary: "C99 起结构体最后一个成员可写 data[]，配合一次 malloc 放变长数据。",
      syntax: "struct Buf { size_t len; unsigned char data[]; };",
      code: `#include <stdio.h>
#include <stdlib.h>

struct Buf { size_t len; unsigned char data[]; };

int main(void) {
    size_t n = 4;
    /* (1) 结构体本身不含 data 的空间，要额外按 n 个字节申请 */
    struct Buf *b = malloc(sizeof *b + n * sizeof b->data[0]);
    if (b == NULL) return 1;
    b->len = n;
    for (size_t i = 0; i < n; i++) b->data[i] = (unsigned char)i;
    /* (2) sizeof(struct Buf) 里 data 被当作不存在 */
    printf("%zu %zu %u\\n", sizeof *b, sizeof(struct Buf), b->data[3]);
    free(b);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "为什么要 sizeof(*b) + n * sizeof(b->data[0])",
          text: "C11 §6.7.2.1 说：多数场合柔性数组成员被忽略，sizeof(struct Buf) 就像它不存在（只可能多一点尾部填充）。因此必须自己把「头部 + n 个元素」一起申请成一块连续内存，标准里的示例正是 malloc(sizeof(struct s) + sizeof(double [m]))。用 sizeof b->data[0] 而不是写死 1，将来换元素类型时不用改这一行。" },
        { n: 2, title: "sizeof 与初始化上的特殊规则",
          text: "柔性数组成员是不完整类型，不能对它用 sizeof，也不能用 `struct Buf b = {1, {2,3}};` 这样直接初始化（标准示例里明确标注 invalid）。含柔性数组的结构体不能作为另一个结构体的成员、也不能作为数组元素——§6.7.2.1p3 有明确约束。另外 WG14 缺陷报告 N2159 指出：结构体尾部填充字节在给其他成员赋值后会取未指定值，可能「吃掉」落在填充区里的前几个数组元素，这是很隐蔽的坑。" }
      ],
      extra: [
        "标准依据：C11 §6.7.2.1p3 / p18 / p20-23；C99 技术勘误 2 修订了 p16-p20 的文字；WG14 N2159 讨论填充字节取值问题。",
        "CERT C MEM33-C 专门讲「动态分配并复制含柔性数组成员的结构体」；DCL38-C 讲正确的柔性数组声明语法。",
        "GCC 的「零长数组」`char data[0]` 是 GNU 扩展，不是 ISO C；GCC 文档 §6.2.2 逐条列了与柔性数组的差别，标准写法是 `data[]`。"
      ],
      pitfalls: [
        "柔性数组成员必须是结构体最后一个成员，且结构体还要有至少一个其它具名成员。",
        "不能直接初始化、不能对它取 sizeof，也不能把这种结构体塞进数组或另一个结构体。",
        "N2159 指出：给其它成员赋值可能让落在尾部填充里的前几个元素变成未指定值。"
      ],
      references: [
        { source: "n1570", topic: "柔性数组成员的定义与示例", section: "§6.7.2.1p3 / p18 / p20-23" },
        { source: "c99-cor2", topic: "柔性数组成员段落修订", section: "§6.7.2.1" },
        { source: "n2159", topic: "柔性数组成员与结构体填充字节", section: "C11 §6.2.6.1p6" },
        { source: "cert-c", topic: "动态分配含柔性数组成员的结构体", section: "MEM33-C / DCL38-C" },
        { source: "gcc-zero-length", topic: "零长数组是 GNU 扩展，与柔性数组的区别", section: "§6.2.2" }
      ],
      related: ["struct-type", "malloc-free", "stdint-fixed-width"]
    },

    {
      id: "calloc-realloc",
      name: "calloc 与 realloc",
      category: "内存管理",
      aliases: ["calloc", "realloc", "扩容", "零初始化", "重新分配", "realloc 失败"],
      summary: "calloc 会清零、realloc 会扩容或搬家；realloc 失败时原内存仍有效。",
      syntax: "int *a = calloc(n, sizeof *a);\nint *tmp = realloc(a, new_n * sizeof *a);",
      code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    /* calloc 的两个参数是「个数」和「每个的大小」，并清零 */
    int *a = calloc(3, sizeof *a);
    if (a == NULL) return 1;

    /* (1) 用临时指针接 realloc：失败时返回 NULL，但原块没被释放 */
    int *tmp = realloc(a, 6 * sizeof *a);
    if (tmp == NULL) { free(a); return 1; }
    a = tmp;
    printf("%d %d\\n", a[0], a[2]);
    free(a);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "为什么不能直接 a = realloc(a, ...)",
          text: "realloc 在申请失败时返回 NULL，而**原来的内存块依然有效、依然需要释放**。如果直接写 a = realloc(a, ...)，失败后 a 变成 NULL，原来的地址就丢了，造成内存泄漏。正确做法是用临时指针接住返回值，成功才赋回 a。CERT C MEM30-C / MEM31-C 里的多个反面例子都和这类误用有关。" }
      ],
      extra: [
        "`calloc(n, size)` 等价于 `malloc(n * size)` 再把字节清零；但「全零字节」不保证等价于浮点 0.0 或空指针，严格一致性上不要依赖。",
        "`realloc` 可能原地扩展，也可能另找一块内存、搬数据并释放旧块；返回后**旧指针一律作废**，只使用返回值。",
        "`realloc(NULL, n)` 等价 malloc(n)；`realloc(p, 0)` 的行为在 C11 与 C23 之间有变化，避免依赖，直接 free。"
      ],
      pitfalls: [
        "realloc 失败返回 NULL 时原内存仍有效，直接覆盖原指针会造成泄漏。",
        "realloc 成功后继续用旧指针是未定义行为（旧块可能已被释放）。",
        "calloc 的两个参数别写反，也别把 malloc(n * sizeof) 的写法套进来漏乘 sizeof。"
      ],
      references: [
        { source: "cert-mem30", topic: "释放后指针失效与 realloc 误用", section: "MEM30-C" },
        { source: "cert-c", topic: "内存管理函数章节", section: "§7.22.3" },
        { source: "n1570", topic: "内存管理函数" }
      ],
      related: ["malloc-free", "dangling-leak", "memcpy-memmove"]
    },

    {
      id: "memcpy-memmove",
      name: "memcpy 与 memmove",
      category: "内存管理",
      aliases: ["memcpy", "memmove", "内存复制", "重叠区间", "memset", "restrict 复制"],
      summary: "都按字节复制；区间重叠时必须用 memmove。",
      syntax: "memcpy(dst, src, n);   // 区间不可重叠\nmemmove(dst, src, n);  // 允许重叠",
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char s[] = "abcdef";
    /* (1) 源与目标在同一块内存里重叠，只能用 memmove */
    memmove(s + 2, s, 4);
    printf("%s\\n", s);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "为什么重叠时 memcpy 不安全",
          text: "memcpy 的两个指针带 restrict 语义（标准要求它像不重叠那样工作），实现可以按「从低地址往高地址」逐字节复制。若目标区间落在源区间后面且重叠，前几个字节会把后面还没读到的源数据覆盖掉，结果就成了 ababab 之类的错误内容。memmove 的实现允许重叠：它会判断方向，必要时从高地址往低地址倒着复制，或先复制到临时缓冲，因此结果确定。" }
      ],
      extra: [
        "两者都按**字节数**复制，遇到 `\\0` 不停止，也不补 `\\0`；n 用 `sizeof` 或元素个数 × `sizeof 元素` 算。",
        "`memset(p, 0, n)` 把字节清零；想给 int 数组赋 1 不能 `memset(a, 1, ...)`，那会把每个字节设成 0x01。",
        "复制结构体直接用赋值 `b = a` 即可，不必 memcpy；但含柔性数组成员的结构体不能这样整体复制（CERT C MEM33-C）。"
      ],
      pitfalls: [
        "区间重叠时用 memcpy 是未定义行为，结果视编译器与复制方向而定。",
        "n 是字节数不是元素个数，`memcpy(dst, src, 3)` 只复制 3 字节。",
        "目标缓冲区不足或源/目标指针为 NULL，都是未定义行为。"
      ],
      references: [
        { source: "n1570", topic: "内存复制函数与 restrict 语义" },
        { source: "cert-c", topic: "MEM33-C 复制含柔性数组成员的结构体" }
      ],
      related: ["restrict-qualifier", "string-functions", "struct-type"]
    },

    {
      id: "fgets-line",
      name: "fgets 逐行读取",
      category: "文件 I/O",
      aliases: ["fgets", "逐行读取", "读一行", "stdin", "换行符", "gets"],
      summary: "按行读字符串，最多读 n-1 个字符并自动补 \\0；会保留行尾的 \\n。",
      syntax: "char buf[256];\nwhile (fgets(buf, sizeof buf, fp) != NULL) { ... }",
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char line[64];
    /* (1) 传 sizeof 而不是写死数字，改数组长度时不会漏改 */
    if (fgets(line, sizeof line, stdin) == NULL) return 1;
    /* (2) fgets 会把行尾的 \\n 一起读进来，按需去掉 */
    line[strcspn(line, "\\n")] = '\\0';
    printf("读到：%s\\n", line);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "sizeof line 为什么要在数组所在作用域算",
          text: "sizeof 只在「数组还看得见完整类型」的作用域里才给出整个数组大小；一旦把数组传给函数，参数会退化成指针（§6.7.6.3p7），sizeof 就只剩指针宽度了。所以在 main 里直接写 sizeof line 是对的，但把 line 传进别的函数再在那里算 sizeof 就是错的。这也是很多「读固定长度」函数要额外传 length 参数的原因。" },
        { n: 2, title: "fgets 保留换行符",
          text: "fgets 最多读 n-1 个字符，遇到换行或 EOF 停止，并在末尾补 \\0。与 gets 不同，换行符 **会** 被存进缓冲区，所以比较、拼接前通常要用 strcspn(line, \"\\n\") 找到它并改成 \\0。若一行超过 n-1 个字符，剩余部分会留在流里，下一次 fgets 接着读——需要按「是否含 \\n」判断这一行是否读完整。" }
      ],
      extra: [
        "`gets` 因为无法限制读入长度已在 C11 中被移除，绝不要使用；CERT C 也有对应规则。",
        "返回值是 char*：成功返回 buf，遇 EOF 且未读到字符返回 NULL，要用 `feof` / `ferror` 区分是结束还是出错。",
        "从 stdin 读时若前面用过 scanf，缓冲区里残留的 \\n 会被 fgets 立刻读到，这是常见的「好像跳过了输入」现象。"
      ],
      pitfalls: [
        "永远不要用 gets；它不检查缓冲区边界，是经典的溢出来源。",
        "fgets 保留 \\n，忘了去掉会让字符串比较莫名失败。",
        "别把 fgets 的返回值直接与 EOF 比较，它返回的是指针，失败是 NULL。"
      ],
      references: [
        { source: "n1570", topic: "fgets 与流输入函数" },
        { source: "cert-c", topic: "STR / FIO 章节关于不安全输入函数的规则" }
      ],
      related: ["fprintf-fscanf", "fopen-modes", "string-functions"]
    },

    {
      id: "fread-fwrite",
      name: "fread 与 fwrite 二进制读写",
      category: "文件 I/O",
      aliases: ["fread", "fwrite", "二进制读写", "rb", "wb", "结构体读写", "块读写"],
      summary: "按「元素大小 × 个数」成块读写；打开模式要带 b。",
      syntax: "size_t n = fread(buf, size, count, fp);\nfwrite(buf, size, count, fp);",
      code: `#include <stdio.h>

int main(void) {
    int a[3] = {1, 2, 3}, b[3] = {0};
    /* (1) 二进制模式要写 "wb" / "rb"，避免文本模式做换行转换 */
    FILE *f = fopen("data.bin", "wb");
    if (f == NULL) return 1;
    fwrite(a, sizeof a[0], 3, f);
    fclose(f);

    f = fopen("data.bin", "rb");
    if (f == NULL) return 1;
    /* (2) 返回值是「成功读到的元素个数」，不一定等于请求的 3 */
    size_t n = fread(b, sizeof b[0], 3, f);
    fclose(f);
    printf("%zu %d %d\\n", n, b[0], b[2]);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "文本模式与二进制模式",
          text: "fopen 的模式串里带 b 表示二进制模式；不带 b 时是文本模式，某些平台（尤其 Windows）会在写入时把 \\n 转成 \\r\\n、读入时反向转换，还可能把 0x1A 当作文件结束。用 fwrite 写 int 数组这类原始字节时，这种转换会静默破坏数据，所以一律写 \"wb\" / \"rb\"。在 POSIX 系统上 b 被忽略，但写上更可移植。" },
        { n: 2, title: "fread 的返回值是元素个数，不是字节数",
          text: "fread(buf, size, count, fp) 返回「完整读到的元素个数」，到达文件尾或出错时可能小于 count。判断是否读完要看这个返回值，或用 feof / ferror 区分两种情况。常见错误是把它当字节数用，或者不看返回值就假定 buf 已被填满。" }
      ],
      extra: [
        "把结构体直接 fwrite 到磁盘**不可移植**：不同编译器的填充、对齐、字节序、类型宽度都可能不同，跨平台要自己序列化每个字段。",
        "`fwrite` 的返回值同样是元素个数；写入失败（磁盘满等）不会抛异常，必须检查。",
        "大文件读写可以配合 `fseek` / `ftell` 定位；但 `ftell` 返回 long，超大文件要考虑 fgetpos / fsetpos。"
      ],
      pitfalls: [
        "文本/二进制模式混用会让 Windows 上的字节内容被改写。",
        "忽略 fread 返回值就假定读满了，短读时 buf 里可能是未初始化数据。",
        "别把内存里的结构体当文件格式，字节序与填充不保证一致。"
      ],
      references: [
        { source: "n1570", topic: "二进制流与 fread / fwrite" },
        { source: "cert-c", topic: "FIO 章节关于文件流的规则" }
      ],
      related: ["fopen-modes", "fprintf-fscanf", "struct-type"]
    },

    {
      id: "conditional-compilation",
      name: "#if 条件编译与头文件保护",
      category: "预处理与宏",
      aliases: ["条件编译", "#if", "#ifdef", "#ifndef", "include guard", "头文件保护", "#endif", "#else"],
      summary: "按宏是否定义/条件真假决定哪些代码参与编译；头文件保护是它最常见的用法。",
      syntax: "#ifndef MY_HEADER_H\n#define MY_HEADER_H\n...\n#endif",
      code: `#include <stdio.h>

/* (1) 开关式条件编译：用 -DDEBUG 打开调试输出 */
#ifdef DEBUG
#  define LOG(x) printf("debug: %d\\n", x)
#else
#  define LOG(x) ((void)0)
#endif

int main(void) {
    LOG(42);
    printf("done\\n");
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "#ifdef 与 #if 的差别",
          text: "#ifdef X 只判断「宏 X 有没有被定义」，不关心它的值；#if 表达式 则求值一个整数常量表达式，未定义的标识符在其中按 0 处理。所以 `#if X` 在 X 未定义时不报错而按 0 走，`#ifdef X` 才是判断定义与否的正确写法。分支里不能写 sizeof 或强制转换——预处理阶段还不认识类型和 sizeof。" }
      ],
      extra: [
        "头文件保护的标准写法：`#ifndef PROJECT_FOO_H` / `#define PROJECT_FOO_H` / 内容 / `#endif`；也可用 `#pragma once`，但它是编译器扩展而非标准。",
        "`defined(X)` 运算符可以嵌在 #if 里组合条件：`#if defined(A) && !defined(B)`。",
        "`#elif` / `#else` 可多级分支；`#error` 能在配置不满足时主动让编译失败并给出提示。"
      ],
      pitfalls: [
        "`#if` 里未定义的宏按 0 处理，写错名字不会报「未定义」，容易静默走错分支。",
        "预处理表达式里不能用 sizeof、类型转换或枚举之外的值，它们属于编译阶段。",
        "宏名别用下划线加大写字母开头，那是实现保留的标识符（CERT C DCL37-C）。"
      ],
      references: [
        { source: "n1570", topic: "条件包含与预处理指令" },
        { source: "cert-list", topic: "PRE / DCL37-C 不要声明或定义保留标识符" }
      ],
      related: ["define-macro", "include-header", "stringify-tokenpaste"]
    },

    {
      id: "stringify-tokenpaste",
      name: "# 字符串化与 ## 连接",
      category: "预处理与宏",
      aliases: ["字符串化", "#", "##", "记号连接", "token paste", "stringify", "宏拼接"],
      summary: "宏参数前加 # 变成字符串字面量，## 把两个记号拼成一个新记号。",
      syntax: "#define STR(x) #x\n#define CAT(a, b) a##b",
      code: `#include <stdio.h>

/* (1) # 把实参原样变成字符串，不做宏展开 */
#define STR(x)  #x
/* (2) ## 把两个记号粘成一个标识符 */
#define CAT(a,b) a##b

int main(void) {
    int value_1 = 7;
    printf("%s\\n", STR(hello));
    printf("%d\\n", CAT(value_, 1));
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "# 的「原样」是什么意思",
          text: "#x 把实参的记号序列变成带引号的字符串字面量，参数里的空格会被规范成一个、引号和反斜杠会被转义，而且**参数不会再被宏展开**。所以 STR(MY_MACRO) 得到的是 \"MY_MACRO\" 而不是它展开后的值；想先展开再字符串化，需要包一层间接宏（先传给一个普通宏让它展开，再传给 STR）。" },
        { n: 2, title: "## 拼的是记号，不是字符串",
          text: "a##b 把左右两个预处理记号粘成一个新记号，结果必须仍是一个合法记号，否则行为未定义。CAT(value_, 1) 拼出标识符 value_1，正好是上面声明的变量。注意 ## 也不能直接拼出字符串或数值常量之外的东西，且两侧参数同样不先展开，复杂场景要用两层宏。" }
      ],
      extra: [
        "两层宏技巧：`#define XSTR(x) STR(x)`，XSTR(MY_MACRO) 会先把 MY_MACRO 展开再交给 STR 字符串化。",
        "# 与 ## 只能用在**宏定义**里，不能写在普通 C 代码中。",
        "生成的标识符若与保留名冲突（下划线+大写开头、双下划线）会踩 CERT C DCL37-C。"
      ],
      pitfalls: [
        "参数在 # / ## 旁不会先展开，直接套一层往往得到错误结果。",
        "## 拼出来的必须是合法记号，拼出 `1e+` 这类东西是未定义行为。",
        "别用 ## 拼出以下划线开头的名字，容易撞上实现保留的标识符。"
      ],
      references: [
        { source: "n1570", topic: "宏替换中的 # 与 ## 运算符" },
        { source: "cert-list", topic: "PRE30-C / DCL37-C 保留标识符与记号拼接" }
      ],
      related: ["define-macro", "macro-pitfall", "conditional-compilation"]
    }

    ,{
      id: "compile-link",
      name: "编译与链接的过程",
      category: "程序结构",
      aliases: ["编译","链接","预处理","目标文件","compile","link","object file","gcc"],
      summary: "一个 .c 文件要经过预处理、编译、汇编、链接四步才变成可执行文件；每一步出错的原因完全不同，看懂报错在哪一步能省很多时间。",
      syntax: "gcc -E a.c -o a.i    /* 只做预处理：展开宏和 #include */\ngcc -c a.c -o a.o    /* 编译 + 汇编：得到目标文件 */\ngcc a.o -o a         /* 链接：拼上库，得到可执行文件 */",
      code: `#include <stdio.h>

/* (1) 预处理阶段：#include 会把 stdio.h 的内容整段抄进来，
 *     宏会被原地替换。这一步只是文本处理，不认识 C 语法。 */

/* (2) 编译阶段：把 C 源码翻译成汇编/机器码。
 *     函数「声明」只需要签名，所以下面这个原型就够编译器检查调用。 */
int add(int a, int b);

int main(void) {
    /* (3) 这里能通过编译，是因为前面有 add 的原型；
     *     但 add 的「定义」并不在这个文件里。 */
    printf("%d\\n", add(2, 3));
    return 0;
}

/* (4) 若注释掉下面这个定义再单独编译，会得到「未定义的引用」——
 *     这是链接错误，不是编译错误。两者的区别是排错的关键。 */
int add(int a, int b) {
    return a + b;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "预处理只做文本替换", text: "预处理器不认识 C 语法，它只干三件事：把 #include 的文件内容原样插入、把 #define 的宏展开、处理 #if 之类的条件编译。所以宏写错导致的报错往往出现在「看起来没问题」的行号上，因为行号已经被改动过。" },
        { n: 2, title: "编译阶段只认声明，不认定义", text: "编译器看到 add(2,3) 时，只需要知道「有个函数叫 add，收两个 int，返回 int」，这就是函数原型的作用。它不需要看到函数体，因此可以把这个文件单独编译成 .o。" },
        { n: 3, title: "链接阶段才拼装所有碎片", text: "链接器把各个 .o 和库拼在一起，找出每个被调用函数的真正地址。如果找不到定义，报错文字是 undefined reference / LNK2019，和编译错误的 syntax error 完全不同——看到前者就别再改语法了。" },
        { n: 4, title: "两类错误的区分价值", text: "编译错误说明代码本身写错了（拼写、类型、缺分号）；链接错误说明「所有代码都对，但拼不起来」（漏了定义、没链接库、重复定义）。分清这一步，能避免在正确的代码上瞎改。" }
      ],
      extra: ["`gcc -E` 能直接看到宏展开后的样子，排查宏问题时非常有用。","头文件里通常只放「声明」，.c 文件里放「定义」，就是为了让多个 .c 能共享声明而不重复定义。","`-c` 只是编译不链接；漏掉 `-c` 时 gcc 会尝试链接，于是报「没有 main」。"],
      pitfalls: ["把「未定义的引用」当成语法错误去改代码，越改越乱。","头文件里直接「定义」变量或函数（而不是声明），多个 .c 包含它就会重复定义。","编译时漏掉某个 .c 文件，报未定义引用；这不是代码问题，是构建命令问题。"],
      references: [
        { source: "n1570", topic: "翻译单元与分别编译" },
        { source: "cert-c", topic: "编译与链接的基本要求" }
      ],
      related: ["main-function","include-header","declare-define","function-prototype"]
    }
    ,{
      id: "multi-file",
      name: "多文件组织与头文件",
      category: "程序结构",
      aliases: ["多文件","头文件保护","extern","分别编译","multi-file","header guard","include guard"],
      summary: "把代码拆成多个 .c 和 .h，用头文件共享声明、用 extern 共享变量；必须给头文件加保护宏，否则重复包含会导致重复定义。",
      syntax: "/* stack.h */\n#ifndef STACK_H\n#define STACK_H\nint push(int v);\nextern int g_count;\n#endif",
      code: `/* 真实工程是三个文件：stack.h / stack.c / main.c，
 * 编译：gcc main.c stack.c -o app
 * 这里把三条规则压进一个文件演示，保证示例可单独编译运行。
 * ================================================================ */

/* (5) 尖括号包含系统头文件；自己写的头文件用双引号，
 *     编译器会先查当前源文件所在目录。 */
#include <stdio.h>

/* (1) 头文件保护宏：防止同一翻译单元内被重复包含。
 *     真实工程里这三行写在 stack.h 最外层。 */
#ifndef STACK_H
#define STACK_H

/* (2) 只放「声明」：告诉编译器有这么个函数和变量，不分配空间。 */
int  push(int v);
extern int g_count;

#endif /* STACK_H */

/* (3) 下面才是「定义」，真实工程里放在 stack.c。
 *     g_count 在整个程序里只能定义这一次。 */
int g_count = 0;

int push(int v) {
    g_count++;
    return v;
}

/* (4) main.c 做的事：包含头文件后就能调用 push、访问 g_count。
 *     若重复展开头文件内容且没有保护宏，就会报重复定义。 */
int main(void) {
    push(1);
    push(2);
    printf("count=%d\\n", g_count);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "头文件保护解决什么问题", text: "如果 a.h 和 b.h 都包含 c.h，而 main.c 同时包含 a.h 和 b.h，c.h 就会被展开两次。若 c.h 里有类型定义或变量定义，第二次就会报重复定义。#ifndef/#define/#endif 让第二次展开时整个文件被跳过。" },
        { n: 2, title: "声明和定义必须分开", text: "头文件可能被多个 .c 包含，所以只能放「声明」（告诉编译器有这么个东西）。函数体、变量赋值这些「定义」必须放在某一个 .c 里，否则链接时会出现多份同名符号。" },
        { n: 3, title: "extern 的确切含义", text: "extern int g_count; 是声明：「有个 int 叫 g_count，在别的翻译单元里定义」。它不分配空间。去掉 extern 写成 int g_count; 就变成定义，每个包含该头文件的 .c 都会各有一份，链接时报重复定义。" },
        { n: 4, title: "定义只能有一份", text: "stack.c 里的 int g_count = 0; 是唯一的定义，它真正分配了存储空间。这是 C 的「单一定义规则」：同一个变量在整个程序里只能定义一次，但可以声明多次。" },
        { n: 5, title: "尖括号和双引号的区别", text: "#include <stdio.h> 只查系统头文件目录；#include \"stack.h\" 先查当前源文件所在目录，再查系统目录。自己写的头文件用双引号，标准库用尖括号。" }
      ],
      extra: ["标准库头文件里也大量使用这种保护宏，比如 `stdio.h` 一般是 `_STDIO_H`。","#pragma once 是编译器扩展，多数编译器支持，但不是标准 C。","只想让某个函数在本文件可见，用 `static` 修饰函数，避免符号冲突。"],
      pitfalls: ["头文件忘写保护宏，被间接包含两次就报重复定义。","在头文件里写 `int g_count = 0;`（没有 extern），多个 .c 包含后链接失败。","把函数定义写进头文件，同样会在多文件构建时重复定义。","包含自己的头文件时用尖括号，结果找不到（尖括号不查当前目录）。"],
      references: [
        { source: "n1570", topic: "翻译单元、外部声明与链接" },
        { source: "cert-c", topic: "头文件与外部标识符" }
      ],
      related: ["include-header","declare-define","compile-link","static-local-global"]
    }
    ,{
      id: "recursion",
      name: "递归",
      category: "函数",
      aliases: ["递归","递归调用","栈溢出","recursion","recursive","stack overflow"],
      summary: "函数直接或间接调用自己。必须有终止条件，否则无限递归导致栈溢出；每层调用都占用栈空间，深度受栈大小限制。",
      syntax: "int fact(int n) {\n    if (n <= 1) return 1;   /* 终止条件 */\n    return n * fact(n - 1); /* 递归调用 */\n}",
      code: `#include <stdio.h>

/* (1) 终止条件写在最前面：n <= 1 时直接返回，不再调用自己 */
int fact(int n) {
    if (n <= 1) return 1;
    /* (2) 递归调用：问题规模从 n 缩到 n-1，保证最终能到达终止条件 */
    return n * fact(n - 1);
}

/* (3) 斐波那契：这里用朴素递归，n 稍大就会重复计算，效率很差 */
int fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}

int main(void) {
    /* (4) 调用递归函数：fact(5) 会依次触发 5 层调用 */
    printf("fact(5)=%d\\n", fact(5));
    printf("fib(10)=%d\\n", fib(10));
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "终止条件必须有，且必须可达", text: "没有终止条件就是无限递归，程序会一直压栈直到栈空间耗尽，通常表现为段错误或 stack overflow。有了终止条件还不够，每层的参数必须真的朝终止条件靠近，否则照样无限。" },
        { n: 2, title: "规模递减是正确性的保证", text: "fact(n) 调用 fact(n-1)，参数严格减小，最终一定能到 n<=1。如果写成 fact(n)，参数不变，就永远到不了终止条件。写递归时先确认「每次调用问题都变小」这一条。" },
        { n: 3, title: "朴素递归的指数级开销", text: "fib(n) 会同时展开 fib(n-1) 和 fib(n-2)，两者又有大量重叠子问题，时间复杂度约为 O(2^n)。fib(40) 就要算十几亿次。改进办法是记忆化或改成循环。" },
        { n: 4, title: "递归与循环的取舍", text: "递归代码通常更贴近问题的数学定义，可读性好；但有函数调用开销，且深度受栈限制（一般几千到几万层）。能用简单循环解决的问题，优先用循环；树、图的遍历这类天然递归的结构，用递归更自然。" }
      ],
      extra: ["尾递归（递归调用是最后一步且结果直接返回）在部分编译器上能被优化成循环，但 C 标准不保证。","递归深度过大时可以把算法改成显式栈（自己维护一个数组当栈）。","任何递归都能改写成循环，但可读性未必更好。"],
      pitfalls: ["忘写终止条件，或终止条件永远不成立，导致栈溢出。","递归调用时参数没有向终止条件靠近（例如把 n-1 写成 n）。","用朴素递归算斐波那契等有大量重叠子问题的场景，性能极差。","在递归函数里定义大数组，每层都占栈，很容易爆栈。"],
      references: [
        { source: "n1570", topic: "函数调用与递归" },
        { source: "cert-c", topic: "递归深度与栈资源" }
      ],
      related: ["function-prototype","pass-by-value","variable-scope"]
    }
    ,{
      id: "static-function",
      name: "static 函数与内部链接",
      category: "函数",
      aliases: ["static 函数","内部链接","文件作用域函数","static function","internal linkage"],
      summary: "给函数加 static，它的可见范围就限制在本 .c 文件内，其他文件即使写了同名函数也不会冲突。适合放只在本文件用到的辅助函数。",
      syntax: "static int helper(int x);   /* 只有本文件能调用 */",
      code: `#include <stdio.h>

/* (1) static：这个函数只在本翻译单元可见，外部链接不到它 */
static int square(int x) {
    return x * x;
}

/* (2) 普通函数：默认是外部链接，别的 .c 只要声明了就能调用 */
int compute(int x) {
    return square(x) + 1;
}

int main(void) {
    printf("%d\\n", compute(3));
    printf("%d\\n", square(4));   /* 本文件内调用没问题 */
    return 0;
}`,
      level: "guided",
      extra: ["两个 .c 各自有一个 `static int helper()` 完全合法，彼此看不见，不会链接冲突。","库函数常这么做：对外只暴露少量接口，内部实现全用 static 藏起来。","static 修饰函数和修饰局部变量的含义不同：修饰函数是「限制链接范围」，修饰局部变量是「延长生命周期」。"],
      pitfalls: ["把 `static` 加到函数上后，别的文件再声明同名函数会得到「未定义引用」——因为它没有被导出。","误以为 static 函数不能被本文件之外的代码通过指针调用（实际上只要拿到地址仍可调用）。","在头文件里声明 static 函数却没有定义，每个包含它的 .c 都会报未定义。"],
      references: [
        { source: "n1570", topic: "标识符的链接（linkage）" },
        { source: "cert-c", topic: "内部链接与符号可见性" }
      ],
      related: ["static-local-global","multi-file","function-prototype"]
    }
    ,{
      id: "string-common-ops",
      name: "字符串常用操作（查找与拼接）",
      category: "数组与字符串",
      aliases: ["strstr","strchr","strcat","strncat","strtok","字符串查找","字符串拼接","字符串分割"],
      summary: "strstr 找子串、strchr 找字符、strcat 拼接、strtok 分割。这些函数都要求目标缓冲区足够大，溢出是 C 里最典型的安全漏洞来源。",
      syntax: "char *strstr(const char *hay, const char *needle);\nchar *strchr(const char *s, int c);\nchar *strcat(char *dst, const char *src);   /* dst 必须够大 */",
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char buf[64] = "hello world";

    /* (1) strstr 返回子串首次出现的指针，找不到返回 NULL */
    char *p = strstr(buf, "world");
    if (p) printf("found at index %ld\\n", (long)(p - buf));

    /* (2) strchr 找单个字符；注意返回值可能是 NULL，必须判断 */
    char ch = 111; char *q = strchr(buf, ch);
    if (q) printf("first o at %ld\\n", (long)(q - buf));

    /* (3) strcat 把 src 追加到 dst 末尾；dst 必须有足够剩余空间 */
    char dst[64] = "abc";
    strcat(dst, "def");
    printf("cat=%s\\n", dst);

    /* (4) strtok 会修改原字符串（把分隔符改成 \\0），不能传字符串字面量 */
    char csv[] = "a,b,c";
    for (char *t = strtok(csv, ","); t; t = strtok(NULL, ","))
        printf("token=%s\\n", t);

    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "返回指针而不是下标", text: "strstr 返回的是指向子串起始位置的指针，不是索引。想知道「第几个字符」，要用返回值减去数组首地址（指针相减得到元素个数）。返回 NULL 表示没找到，所以调用后必须判空再解引用。" },
        { n: 2, title: "strchr 的第二个参数是 int", text: "虽然找的是字符，但参数类型是 int，因为要能表示 EOF（通常是 -1）。传 char 会被提升成 int，一般没问题；但传入的值若超出 unsigned char 范围，行为未定义。" },
        { n: 3, title: "strcat 的空间责任在使用者", text: "strcat 不检查 dst 还剩多少空间，它只管从 dst 的 \\0 处开始往后写。空间不够就直接越界写内存。安全做法是算好长度，或用 strncat 并正确计算剩余空间（注意 strncat 的 n 是「最多追加几个字符」，不是缓冲区总大小）。" },
        { n: 4, title: "strtok 的破坏性与全局状态", text: "strtok 直接在原串上把分隔符替换成 \\0，所以原字符串被破坏，且不能用于字符串字面量（字面量是只读的，写入会崩）。它内部还保存了「上次切到哪」的状态，因此不可重入、不能嵌套使用。需要并行处理多个串时用 strtok_r。" }
      ],
      extra: ["`strtok` 连续的分隔符会被当作一个；想保留空字段要自己写解析。","`strtok_r` 是可重入版本，多线程或嵌套解析时用它。","`strncat(dst, src, n)` 最多追加 n 个字符，之后仍会自动补 `\\0`。"],
      pitfalls: ["不判断 `strstr` / `strchr` 返回 NULL 就直接解引用。","`strcat` 目标缓冲区不够大，造成缓冲区溢出（经典安全漏洞）。","把字符串字面量传给 `strtok`，尝试写入只读内存导致崩溃。","嵌套或并发使用 `strtok`，状态互相干扰，结果错乱。","误以为 `strncat` 的第三个参数是「缓冲区总大小」，实际是「最多追加几个字符」。"],
      references: [
        { source: "n1570", topic: "strstr / strchr / strcat / strtok" },
        { source: "cert-c", topic: "STR 系列：字符串与缓冲区边界" }
      ],
      related: ["string-functions","string-null-terminator","fgets-line","array-1d"]
    }
    ,{
      id: "array-parameter",
      name: "数组作为函数参数",
      category: "数组与字符串",
      aliases: ["数组传参","数组退化","array parameter","array decay","传数组"],
      summary: "数组传参时并不会复制整个数组，而是退化成指向首元素的指针；所以函数里 sizeof 拿不到真实长度，必须额外传长度。",
      syntax: "void show(int a[], int n);   /* 等价于 int *a */\nvoid show(int *a, int n);",
      code: `#include <stdio.h>

/* (1) a[] 和 *a 在参数位置上完全等价：都只是一个指针 */
void show(int a[], int n) {
    /* (2) 这里 sizeof(a) 是指针的大小（常见 8 字节），不是整个数组 */
    printf("sizeof(a)=%zu\\n", sizeof(a));
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\\n");
}

int main(void) {
    int arr[5] = {1, 2, 3, 4, 5};
    /* (3) main 里 sizeof(arr) 才是整个数组：5 * sizeof(int) */
    printf("sizeof(arr)=%zu\\n", sizeof(arr));
    show(arr, 5);   /* (4) 数组名退化成 &arr[0] */
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "两种写法本质相同", text: "参数列表里的 int a[] 会被编译器改写成 int *a，方括号里的数字即使写了也会被忽略。所以 void f(int a[10]) 和 void f(int *a) 是同一个函数，无法通过参数声明来「约束长度」。" },
        { n: 2, title: "sizeof 在函数内失效", text: "因为 a 已经是指针，sizeof(a) 得到的是指针大小（64 位平台通常是 8），不是数组总字节数。这是初学者最容易踩的坑：在本文件里算得对，一传进函数就算错。" },
        { n: 3, title: "为什么 main 里是对的", text: "arr 是真正的数组对象，sizeof(arr) 在编译期就能算出 5 * sizeof(int) = 20。数组名只有在「作为参数传递」或「参与表达式」时才退化成指针，sizeof 是少数不退化的场合之一。" },
        { n: 4, title: "因此长度必须显式传", text: "函数完全不知道数组有多长，所以标准做法是额外传一个 n。这也是为什么 C 标准库函数都带长度参数（如 memcpy、fread）。想同时传长度又不想多写参数，可以用「结构体包一个数组 + 长度」的方式。" }
      ],
      extra: ["`void f(int a[static 10])` 是 C99 的写法，表示「至少 10 个元素」，编译器可据此优化，但不做运行期检查。","多维数组传参必须指定除第一维外的所有维度：`void f(int a[][3])`。","想真正传递整个数组的副本，可以把它包进结构体，结构体赋值会整体复制。"],
      pitfalls: ["在函数里用 `sizeof(a)` 想求数组长度，得到的是指针大小。","以为 `void f(int a[10])` 会检查调用者真的传了 10 个元素（不会检查）。","多维数组传参时漏写后面的维度，例如写成 `int **`，类型对不上。","传了数组却忘了传长度，函数越界读写。"],
      references: [
        { source: "n1570", topic: "数组到指针的转换（6.3.2.1）" },
        { source: "cert-c", topic: "ARR 系列：数组边界" }
      ],
      related: ["array-vs-pointer","pointer-array","array-1d","multidim-array"]
    }
    ,{
      id: "struct-array",
      name: "结构体数组与成员访问",
      category: "复合类型",
      aliases: ["结构体数组","数组的指针","指针访问成员","struct array","->","点运算符"],
      summary: "用 . 访问结构体变量的成员，用 -> 访问结构体指针的成员。结构体数组就是每个元素都是一个结构体的数组，常用来存一组记录。",
      syntax: "p->x    /* 等价于 (*p).x */\narr[i].x",
      code: `#include <stdio.h>
#include <string.h>

typedef struct {
    int id;
    char name[16];
    double score;
} Student;

int main(void) {
    /* (1) 结构体数组：每个元素都是一整个 Student */
    Student list[3] = {
        {1, "Alice", 91.5},
        {2, "Bob",   78.0},
        {3, "Carol", 85.5}
    };

    /* (2) 数组元素是变量，用 . 访问成员 */
    list[0].score = 95.0;

    /* (3) 指向结构的指针，用 -> 访问成员 */
    Student *p = &list[1];
    printf("p->id=%d  (*p).id=%d\\n", p->id, (*p).id);

    /* (4) 结构体整体赋值会逐成员复制（含数组） */
    Student copy = list[2];
    strcpy(copy.name, "Carol2");
    printf("orig=%s copy=%s\\n", list[2].name, copy.name);

    for (int i = 0; i < 3; i++)
        printf("%d %s %.1f\\n", list[i].id, list[i].name, list[i].score);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "结构体数组是「连续的记录」", text: "Student list[3] 在内存里是 3 个 Student 紧挨着排，每个包含 id、name、score。这种布局对缓存友好，遍历时效率高，是最常用的数据组织方式。" },
        { n: 2, title: "点是给「变量」用的", text: "list[0] 是一个 Student 类型的变量（可以理解为左值），所以用 list[0].score。只要左边是结构体本身，就用点。" },
        { n: 3, title: "箭头是给「指针」用的", text: "p 是 Student *，不是 Student 本身。p->id 是 (*p).id 的简写：先解引用拿到结构体，再取成员。因为 . 的优先级比 * 高，所以括号不能省，这就是 -> 存在的理由。" },
        { n: 4, title: "结构体赋值是整体复制", text: "Student copy = list[2]; 会把所有成员（包括 name 数组）逐字节复制过去。之后改 copy.name 不影响 list[2].name。但如果成员里有指针，复制的只是指针值（浅拷贝），两个结构体会指向同一块内存。" }
      ],
      extra: ["初始化结构体数组时，没写到的成员会被补 0 / NULL。","C99 起可以用指定初始化器：`{.id = 1, .name = \"A\"}`，不必按顺序。","结构体之间不能直接用 `==` 比较，要逐成员比较，或用 `memcmp`（注意填充字节的问题）。"],
      pitfalls: ["对指针用 `.`、对变量用 `->`，编译直接报错。","写过 `*p.x`，实际含义是 `*(p.x)`，类型错误；应为 `(*p).x` 或 `p->x`。","结构体里有指针成员时用整体赋值，误以为是深拷贝。","用 `memcmp` 比较结构体，填充字节里是垃圾值，导致「明明相同却不相等」。"],
      references: [
        { source: "n1570", topic: "结构体成员访问运算符 . 与 ->" },
        { source: "cert-c", topic: "结构体初始化与成员访问" }
      ],
      related: ["struct-type","pointer-deref","typedef-alias","array-1d"]
    }
    ,{
      id: "struct-padding",
      name: "结构体内存布局与对齐",
      category: "复合类型",
      aliases: ["内存对齐","填充字节","padding","alignment","offsetof","结构体大小"],
      summary: "编译器会在成员之间插入填充字节，让每个成员落在对齐边界上，所以结构体大小往往大于成员大小之和；调整成员顺序可以减小体积。",
      syntax: "sizeof(struct S)      /* 含填充 */\noffsetof(struct S, member)   /* <stddef.h> */",
      code: `#include <stdio.h>
#include <stddef.h>

/* (1) char 占 1 字节，但 int 要求 4 字节对齐，
 *     所以 a 之后会插入 3 字节填充，c 之后还会再补 3 字节 */
struct Bad {
    char  a;
    int   b;
    char  c;
};

/* (2) 把大的成员放前面，填充会显著减少 */
struct Good {
    int   b;
    char  a;
    char  c;
};

int main(void) {
    /* (4) 同一批成员，只因为顺序不同，大小就差了 4 字节 */
    printf("Bad  = %zu\\n", sizeof(struct Bad));
    printf("Good = %zu\\n", sizeof(struct Good));
    /* (3) offsetof 能看到每个成员的实际偏移，填充就在空隙里 */
    printf("Bad.b offset = %zu\\n", offsetof(struct Bad, b));
    printf("Bad.c offset = %zu\\n", offsetof(struct Bad, c));
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "为什么要对齐", text: "多数 CPU 访问 4 字节 int 时要求地址是 4 的倍数，否则要么变慢（多次访问拼装），要么直接出错。编译器为了保证合法，会在成员之间插入不存数据的「填充字节」，让下一个成员落到正确边界。" },
        { n: 2, title: "调换顺序减少填充", text: "Bad 里 char 后面紧跟 int，中间要补 3 字节；末尾还要补齐到 4 的倍数，总共 12 字节。Good 把 int 放最前，两个 char 相邻，末尾补 2 字节，共 8 字节。同样的数据，省了 4 字节。" },
        { n: 3, title: "offsetof 验证布局", text: "offsetof(struct Bad, b) 会打印 4，说明 a 之后确实空出了 3 字节。这是观察对齐最直接的工具，比用 sizeof 猜更准确。" },
        { n: 4, title: "填充字节里是什么", text: "标准没有规定填充内容，可能是任意值。所以不能用 memcmp 比较两个「逻辑上相同」的结构体——填充字节可能不同。也不能直接把结构体整体写入文件再读回来当作稳定格式。" }
      ],
      extra: ["想紧凑布局可以用 `#pragma pack(1)` 或 `__attribute__((packed))`，但会牺牲访问速度，跨平台也不可移植。","网络协议、文件格式中的结构体要注意字节序（大小端）和填充，通常需要手动序列化。","`sizeof` 的结果在编译器之间可能不同，不要假定固定值。"],
      pitfalls: ["以为 `sizeof(struct)` 等于各成员大小之和，忘了填充。","用 `memcmp` 比较结构体（填充字节是垃圾值）。","把结构体直接 `fwrite` 到文件当格式，换平台或换编译器就读不出来了。","用 `#pragma pack(1)` 后对成员取地址并强制转换，触发未对齐访问。"],
      references: [
        { source: "n1570", topic: "结构体成员的对齐与 offsetof" },
        { source: "cert-c", topic: "EXP 系列：对齐与对象表示" }
      ],
      related: ["struct-type","bit-field","sizeof-operator","memcpy-memmove"]
    }
    ,{
      id: "memory-layout",
      name: "程序的内存分区",
      category: "内存管理",
      aliases: ["内存布局","栈区","堆区","数据段","bss","memory layout","stack","heap"],
      summary: "一个运行中的 C 程序，内存大致分为代码段、数据段、BSS、堆和栈；理解各区的生命周期，才能解释「为什么局部变量不能返回地址」。",
      syntax: "/* 栈：函数调用自动分配，返回即失效 */\n/* 堆：malloc 申请，free 释放 */\n/* 全局/静态：程序启动到结束 */",
      code: `#include <stdio.h>
#include <stdlib.h>

int  g_init = 42;      /* (1) 数据段：已初始化的全局变量 */
int  g_zero;           /* (2) BSS：未初始化，启动时清零 */

void demo(void) {
    int  local = 1;            /* (3) 栈：进入函数时分配 */
    int *heap = malloc(4);     /* (4) 堆：手动申请，手动释放 */
    if (!heap) return;
    *heap = 2;
    printf("local=%d heap=%d\\n", local, *heap);
    free(heap);
}

int main(void) {
    demo();
    printf("g_init=%d g_zero=%d\\n", g_init, g_zero);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "数据段存「有初值的全局/静态」", text: "g_init 的初值 42 需要写进可执行文件，所以它放在数据段。程序加载时这部分内容从文件读入内存，生命周期贯穿整个程序。" },
        { n: 2, title: "BSS 存「没初值的全局/静态」", text: "g_zero 没有显式初始化，标准规定它会被初始化为 0。为了不让可执行文件白白变大，这类变量单独放在 BSS 段，只记录「需要多少空间」，加载时统一清零。" },
        { n: 3, title: "栈由函数调用自动管理", text: "local 在进入 demo 时自动分配，demo 返回时自动回收。所以把 local 的地址返回给调用者是错误的——函数返回后那块栈空间随时会被别的调用覆盖，这就是「返回局部变量地址」的经典 bug。" },
        { n: 4, title: "堆的生命周期由你决定", text: "malloc 申请的 4 字节一直有效，直到你 free 它或程序结束。它不随函数返回而失效，所以能用来「返回一块数据」。代价是必须自己 free，漏了就泄漏。" }
      ],
      extra: ["栈的大小通常很小（Windows 默认 1MB 左右），在栈上开大数组很容易爆栈。","堆空间大得多，但分配/释放有开销，且频繁申请小块内存会产生碎片。","字符串字面量通常放在只读段，尝试修改会崩溃。"],
      pitfalls: ["返回局部变量的地址（栈空间在函数返回后失效）。","在栈上定义超大数组导致栈溢出。","以为全局变量和局部变量初始值规则相同（全局自动清零，局部不确定）。","尝试修改字符串字面量（位于只读段）。"],
      references: [
        { source: "n1570", topic: "对象的存储期（storage duration）" },
        { source: "cert-mem30", topic: "对象生命周期与访问" }
      ],
      related: ["variable-scope","static-local-global","malloc-free","dangling-leak"]
    }
    ,{
      id: "memory-leak-patterns",
      name: "常见内存错误与排查",
      category: "内存管理",
      aliases: ["内存错误","重复释放","越界写","use after free","double free","buffer overflow"],
      summary: "C 的内存错误主要有四类：泄漏、重复释放、释放后使用、越界读写。它们往往不会当场崩溃，而是过一段时间才出问题，所以很难查。",
      syntax: "/* 四类经典错误 */\nfree(p); free(p);        /* 重复释放 */\nfree(p); *p = 1;         /* 释放后使用 */\narr[n] = 0;              /* 越界写 */",
      code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    /* (1) 泄漏：申请后没有 free，程序运行越久占用越多 */
    int *leak = malloc(100 * sizeof(int));
    if (!leak) return 1;
    memset(leak, 0, 100 * sizeof(int));
    /* 忘了 free(leak) */

    /* (2) 释放后使用：free 之后那块内存已不属于你 */
    int *p = malloc(sizeof(int));
    if (!p) return 1;
    *p = 5;
    free(p);
    /* *p = 6;  <-- 未定义行为，可能看似正常也可能崩溃 */
    p = NULL;   /* 好习惯：置空，避免下次误用 */

    /* (3) 重复释放：free(NULL) 是安全的，但 free 同一个有效指针两次不是 */
    if (p) { free(p); p = NULL; }

    /* (4) 越界写：数组只保证 n 个元素，写 n 就是破坏别人的内存 */
    int *arr = malloc(3 * sizeof(int));
    if (!arr) return 1;
    for (int i = 0; i < 3; i++) arr[i] = i;   /* 正确：0..2 */
    free(arr);

    printf("done\\n");
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "泄漏为什么难发现", text: "漏掉 free 不会报错，进程照样跑。只有在长时间运行、反复分配的程序里，内存才会缓慢增长直到耗尽。所以「能跑通」不等于「没泄漏」。" },
        { n: 2, title: "释放后使用为什么危险", text: "free 只是把这块内存标记为「可再分配」，内容通常还在。你紧接着读它，可能读到旧值，看起来一切正常；但如果期间别处 malloc 走了这块内存，你就在悄悄破坏别人的数据。这类 bug 极难复现。" },
        { n: 3, title: "重复释放的连锁破坏", text: "第二次 free 同一块内存会破坏堆管理结构，可能导致后续任意一次 malloc/free 崩溃——崩溃点离出错点很远。防御手段是释放后立刻把指针置 NULL，因为 free(NULL) 是标准明确允许的空操作。" },
        { n: 4, title: "越界写是最常见的漏洞源", text: "malloc(3 * sizeof(int)) 只保证 3 个元素，arr[3] 已经越界。堆上越界会覆盖相邻块的元数据或别人的数据，是缓冲区溢出漏洞的根源。所有下标访问都要确认边界。" }
      ],
      extra: ["AddressSanitizer（gcc/clang 的 `-fsanitize=address`）能在运行时抓到越界和释放后使用，调试时强烈建议开启。","`valgrind --leak-check=full` 可以定位泄漏点和泄漏字节数。","规则：谁申请谁释放；释放后立即置 NULL；分配后立刻检查是否为 NULL。"],
      pitfalls: ["申请后不检查 malloc 是否返回 NULL（内存不足时会返回 NULL）。","free 之后继续通过原指针访问内存。","同一指针被 free 两次（常见于多个分支都写了 free）。","循环里反复 malloc 而不 free，内存持续上涨。","数组下标写到 n（应为 0..n-1）。"],
      references: [
        { source: "cert-mem30", topic: "不要访问已释放的内存" },
        { source: "cert-c", topic: "MEM 系列：内存管理规则" }
      ],
      related: ["malloc-free","dangling-leak","calloc-realloc","memory-layout"]
    }
    ,{
      id: "fseek-position",
      name: "文件定位 fseek 与 ftell",
      category: "文件 I/O",
      aliases: ["fseek","ftell","rewind","文件定位","文件大小","SEEK_SET","SEEK_END"],
      summary: "fseek 移动文件读写位置，ftell 报告当前位置；配合 SEEK_END 可以求文件大小。文本模式下定位有平台差异，二进制模式才可靠。",
      syntax: "int fseek(FILE *fp, long offset, int origin);\nlong ftell(FILE *fp);\nrewind(fp);   /* 等价于 fseek(fp, 0, SEEK_SET) 并清除错误标志 */",
      code: `#include <stdio.h>

int main(void) {
    FILE *fp = fopen("demo.txt", "wb");
    if (!fp) { perror("fopen"); return 1; }
    fputs("0123456789", fp);
    fclose(fp);

    fp = fopen("demo.txt", "rb");
    if (!fp) { perror("fopen"); return 1; }

    /* (1) 移到末尾，ftell 得到文件长度（字节） */
    fseek(fp, 0, SEEK_END);
    long size = ftell(fp);
    printf("size=%ld\\n", size);

    /* (2) 回到开头再读，否则文件位置还在末尾 */
    fseek(fp, 0, SEEK_SET);
    int ch = fgetc(fp);
    printf("first=%c\\n", ch);

    /* (3) 相对当前位置跳过 3 个字节 */
    fseek(fp, 3, SEEK_CUR);
    printf("at %ld: %c\\n", ftell(fp), fgetc(fp));
    /* (4) 文本模式下 ftell 与真实字节数可能不一致，本例用二进制模式避免 */

    fclose(fp);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "SEEK_END 求大小的用法", text: "把位置移到文件末尾，此时的偏移量就是文件总字节数。这是求文件大小最常用的办法。注意返回值是 long，超大文件（>2GB）在 32 位平台上会溢出，需要 fseeko/ftello 或平台特定接口。" },
        { n: 2, title: "读之前要回到起点", text: "fseek 到末尾后，文件位置就在末尾，这时直接 fgetc 会读到 EOF。必须再 fseek(fp, 0, SEEK_SET) 回到开头。忘记这一步是「明明有内容却读不到」的常见原因。" },
        { n: 3, title: "SEEK_CUR 的相对移动", text: "第三个参数指明基准点：SEEK_SET 从文件头算、SEEK_CUR 从当前位置算、SEEK_END 从文件尾算。偏移可以是负数，但定位到文件开头之前是未定义行为。" },
        { n: 4, title: "文本模式的坑", text: "Windows 下文本模式会把 \\r\\n 转成 \\n，导致 ftell 的值和实际文件字节数对不上。要做精确的字节级定位，必须用 \"rb\" 二进制模式打开。" }
      ],
      extra: ["`rewind(fp)` 回到开头，同时清除错误标志；`fseek(fp,0,SEEK_SET)` 不清除。","fseek 成功返回 0，失败返回非 0，管道/终端这类不可定位的流会失败。","大文件用 `_fseeki64` / `fseeko` 以避免 long 溢出。"],
      pitfalls: ["在文本模式下用 ftell 当文件大小，Windows 上会偏大。","fseek 到末尾后忘了回到开头，读不到数据。","不检查 fseek 返回值，对不可定位的流（如管道）定位失败后继续读。","用 long 存超大文件偏移，32 位平台上溢出。"],
      references: [
        { source: "n1570", topic: "fseek / ftell / rewind" },
        { source: "cert-c", topic: "FIO 系列：文件输入输出" }
      ],
      related: ["fopen-modes","fread-fwrite","fgets-line","fprintf-fscanf"]
    }
    ,{
      id: "file-error-handling",
      name: "文件操作的错误处理",
      category: "文件 I/O",
      aliases: ["perror","strerror","ferror","feof","errno","文件错误","错误处理"],
      summary: "文件操作几乎每一步都可能失败，必须检查返回值。perror 打印可读的错误原因，feof 判断「是否读到结尾」的方式有陷阱，不能用来控制循环。",
      syntax: "if (!fp) { perror(\"fopen\"); return 1; }\nwhile (fgets(buf, sizeof buf, fp)) { ... }   /* 正确写法 */",
      code: `#include <stdio.h>
#include <errno.h>
#include <string.h>

int main(void) {
    /* (1) fopen 失败返回 NULL，errno 会被设置 */
    FILE *fp = fopen("no_such_file.txt", "r");
    if (!fp) {
        /* (2) perror 自动带上 errno 对应的说明 */
        perror("fopen");
        /* (3) strerror 把 errno 转成字符串，便于自定义格式 */
        printf("errno=%d: %s\\n", errno, strerror(errno));
        return 1;
    }
    fclose(fp);

    /* (4) 正确读整个文件：用 fgets 的返回值判断，而不是 feof */
    fp = fopen("data.txt", "r");
    if (!fp) { perror("fopen data.txt"); return 1; }
    char buf[256];
    while (fgets(buf, sizeof buf, fp)) {
        fputs(buf, stdout);
    }
    /* (5) 循环结束后再区分：是正常读完，还是读出错 */
    if (ferror(fp)) printf("读取过程中出错\\n");
    fclose(fp);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "每个可能失败的调用都要查", text: "fopen 失败返回 NULL，fclose/fread/fwrite 失败返回 EOF 或短计数。不检查就直接用，轻则读到垃圾，重则解引用空指针崩溃。" },
        { n: 2, title: "perror 输出什么", text: "perror(\"fopen\") 会打印 \"fopen: No such file or directory\" 这样的形式——前缀是你给的字符串，冒号后面是 errno 对应的系统说明。定位「为什么打不开」非常高效。" },
        { n: 3, title: "strerror 适合自定义格式", text: "strerror(errno) 返回一句静态字符串描述。想拼进自己的日志格式时用它。注意它返回的缓冲区可能被后续调用覆盖，需要保留就自己复制一份。" },
        { n: 4, title: "feof 的控制循环陷阱", text: "很多人写 while (!feof(fp)) { fgets(...); }，这会多执行一次——feof 只有在「尝试读并失败」之后才为真，所以最后一次循环里读到的是无效数据。正确做法是直接用 fgets 的返回值当条件。" },
        { n: 5, title: "ferror 与 feof 的分工", text: "循环结束后，feof(fp) 为真说明正常到达文件末尾；ferror(fp) 为真说明发生了读错误。两者要分开判断，才能给出正确提示。" }
      ],
      extra: ["`errno` 不是每次调用都会重置，所以应该在确认失败之后立刻读它。","`fclose` 也可能失败（例如缓冲区刷盘失败），写文件时应该检查它的返回值。","严格来说 `ferror` 返回非零表示有错误，具体错误码仍在 `errno` 里。"],
      pitfalls: ["用 `while (!feof(fp))` 控制读取循环，导致最后一次处理无效数据。","不检查 fopen 返回值，直接 fread/fgets。","读失败和读到结尾不区分，错误被当成「文件结束」静默忽略。","忘记 fclose，导致缓冲区内容没写盘、文件句柄泄漏。"],
      references: [
        { source: "n1570", topic: "fopen / ferror / feof / errno" },
        { source: "cert-c", topic: "FIO 系列：文件操作返回值检查" }
      ],
      related: ["fopen-modes","fgets-line","fread-fwrite","fseek-position"]
    }
    ,{
      id: "predefined-macros",
      name: "预定义宏与调试辅助",
      category: "预处理与宏",
      aliases: ["__FILE__","__LINE__","__func__","预定义宏","调试宏","assert","predefined macros"],
      summary: "C 预定义了几个宏：__FILE__ 是文件名、__LINE__ 是行号、__func__ 是函数名、__DATE__/__TIME__ 是编译时间。用它们能写出定位精确的调试输出。",
      syntax: "printf(\"%s:%d\\n\", __FILE__, __LINE__);",
      code: `#include <stdio.h>

/* (1) 用 __LINE__ 和 __FILE__ 做带位置的日志，
 *     比手写行号可靠得多（改了代码行号自动更新） */
#define LOG(fmt, ...) \\
    printf("[%s:%d] " fmt "\\n", __FILE__, __LINE__, ##__VA_ARGS__)

void check(int v) {
    /* (2) __func__ 是当前函数名的字符串 */
    printf("in %s, v=%d\\n", __func__, v);
    if (v < 0) LOG("negative value: %d", v);
}

int main(void) {
    check(-1);
    check(7);
    /* (3) 编译时间戳，适合 build 信息，不适合运行期逻辑 */
    printf("built at %s %s\\n", __DATE__, __TIME__);
    printf("this line is %d\\n", __LINE__);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "为什么用宏而不是手写", text: "手写 \"[main.c:42]\" 这种行号，一旦在前面加了几行就全错了。__FILE__ 和 __LINE__ 由编译器在展开时填入真实值，永远准确，是调试输出最省事的做法。" },
        { n: 2, title: "__func__ 是变量不是宏", text: "严格说 __func__ 是标准规定的「函数内预定义标识符」，类型是 static const char[]，不是预处理器宏。它只在函数体内有效，在全局作用域用它编译不过。" },
        { n: 3, title: "__DATE__ 与 __TIME__ 的用途", text: "它们展开成编译那一刻的日期和时间字符串（如 \"Nov 11 2026\"）。只适合放进版本信息、构建说明里，绝不能用来做运行期的时间判断——它是编译时间，不是当前时间。" }
      ],
      extra: ["还有 `__STDC__`、`__STDC_VERSION__` 可用来判断编译器支持的 C 标准版本。","`##__VA_ARGS__` 是 GCC 扩展，用于让可变参数为空时不留多余逗号；标准写法需要至少一个参数。","`assert` 宏失败时会打印文件名、行号和表达式，本质上也依赖这些预定义宏。"],
      pitfalls: ["把 `__DATE__`/`__TIME__` 当成运行期时间用。","在全局作用域使用 `__func__`（只能用于函数体内）。","以为 `__LINE__` 是「错误发生的行」，其实是「宏展开所在的行」。","依赖 `##__VA_ARGS__` 却不考虑非 GCC 编译器。"],
      references: [
        { source: "n1570", topic: "预定义宏名（6.10.8）" },
        { source: "cert-c", topic: "PRE 系列：预处理指令" }
      ],
      related: ["define-macro","macro-pitfall","stringify-tokenpaste","conditional-compilation"]
    }
    ,{
      id: "undef-and-pragma",
      name: "#undef 与 #pragma",
      category: "预处理与宏",
      aliases: ["undef","pragma","pragma once","取消宏定义","编译指令"],
      summary: "#undef 取消一个宏定义，#pragma 是实现定义的编译指令；#pragma once 让头文件只被包含一次，比保护宏更简洁但不是标准 C。",
      syntax: "#undef MAX\n#pragma once\n#pragma pack(push, 1)",
      code: `#include <stdio.h>

#define MODE 1

int main(void) {
#if MODE == 1
    printf("mode 1\\n");
#endif

    /* (1) #undef 之后 MODE 就不存在了 */
#undef MODE
#ifdef MODE
    printf("still defined\\n");
#else
    printf("MODE undefined now\\n");
#endif

    /* (2) 重复 #define 同名宏且内容不同，多数编译器会警告 */
#define MODE 2
    printf("redefined to %d\\n", MODE);
    return 0;
}`,
      level: "guided",
      extra: ["`#pragma once` 被 GCC/Clang/MSVC 普遍支持，但标准只要求编译器「忽略不认识的 pragma」。","`#pragma pack(push, 1)` / `pop` 用来临时改变结构体对齐，务必成对使用。","`#undef` 常用于避免与系统头文件的宏冲突。"],
      pitfalls: ["以为 `#pragma once` 是标准 C（不是，但实践中几乎都支持）。","`#pragma pack` 忘记 `pop`，导致后面所有结构体都被紧凑排列。","在头文件里 `#undef` 别人定义的宏，破坏包含者的预期。"],
      references: [
        { source: "n1570", topic: "#undef 与 #pragma（6.10.3、6.10.6）" },
        { source: "cert-c", topic: "PRE 系列：预处理指令" }
      ],
      related: ["define-macro","conditional-compilation","multi-file","predefined-macros"]
    }
    ,{
      id: "void-pointer",
      name: "void* 通用指针",
      category: "指针",
      aliases: ["void*","通用指针","万能指针","void pointer","generic pointer"],
      summary: "void* 能存任何对象指针，但不能直接解引用，也不能做指针运算；用之前必须先转回具体类型。它是 C 里实现「泛型」的传统手段。",
      syntax: "void *p = &x;\nint *q = (int *)p;   /* 用之前转回具体类型 */\n*p;                  /* 错误：void 大小未知 */",
      code: `#include <stdio.h>
#include <string.h>

/* (1) 用 void* 接收任意类型的数组，类似 memcpy 的做法 */
void fill_zero(void *base, size_t count, size_t elem_size) {
    /* (2) 必须转成 char* 才能按字节移动，因为 void* 不能运算 */
    unsigned char *p = (unsigned char *)base;
    memset(p, 0, count * elem_size);
}

int main(void) {
    int arr[4] = {1, 2, 3, 4};
    fill_zero(arr, 4, sizeof(arr[0]));
    printf("%d %d %d %d\\n", arr[0], arr[1], arr[2], arr[3]);

    /* (3) 任意对象指针都能隐式转成 void*，反向需要显式转换 */
    void *raw = arr;
    int *back = (int *)raw;
    printf("back[1]=%d\\n", back[1]);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "void* 解决的泛型问题", text: "C 没有模板，想让函数处理「任意类型数组」，只能让参数收 void*，再额外传元素大小。标准库的 memcpy、qsort、bsearch 都是这个套路。" },
        { n: 2, title: "为什么不能直接对 void* 运算", text: "指针加法需要知道「一步跨多少字节」。void 没有大小，编译器不知道 p+1 应该前进几个字节，所以标准禁止对 void* 做算术。必须先转成 char*（或具体类型指针）才能移动。" },
        { n: 3, title: "隐式去、显式回", text: "任何对象指针赋给 void* 都是安全的，不需要强转。但从 void* 转回具体类型必须显式写出来，因为编译器丢失了类型信息，无法替你检查。这一步写错了编译器不会拦你。" }
      ],
      extra: ["函数指针不能转成 void*（标准不允许，虽然部分平台能跑）。","`qsort` 的比较函数签名是 `int (*)(const void *, const void *)`，内部要自己转回具体类型。","C++ 要求从 void* 转出必须显式转换，C 可以隐式，写显式转换在两边都能编译。"],
      pitfalls: ["对 void* 直接解引用（`*p`），编译报错。","对 void* 做算术（`p + 1`），标准不允许。","从 void* 转回错误的类型，编译器不报错，运行时读到垃圾。","把函数指针转成 void* 再转回来（未定义行为）。"],
      references: [
        { source: "n1570", topic: "void 类型与指针转换（6.3.2.3）" },
        { source: "cert-c", topic: "EXP 系列：指针转换" }
      ],
      related: ["pointer-deref","memcpy-memmove","function-pointer","void-type"]
    }
    ,{
      id: "comma-operator",
      name: "逗号运算符",
      category: "运算符",
      aliases: ["逗号运算符","逗号表达式","comma operator","sequence point"],
      summary: "逗号表达式从左到右依次求值，整个表达式的值是最后一个的值。注意区分「逗号运算符」和「参数分隔用的逗号」，二者完全不同。",
      syntax: "int x = (a = 1, b = 2, a + b);   /* x 得 3 */",
      code: `#include <stdio.h>

int main(void) {
    int a, b, x;

    /* (1) 括号里是逗号表达式：依次执行，整体取最后一个值 */
    x = (a = 1, b = 2, a + b);
    printf("a=%d b=%d x=%d\\n", a, b, x);

    /* (2) 没有括号时，逗号优先级最低，x 只拿到 a = 1 的值 */
    int y = (a = 10, b = 20);
    printf("y=%d\\n", y);

    /* (3) for 里的逗号常用于同时初始化/更新两个变量 */
    for (int i = 0, j = 5; i < j; i++, j--)
        printf("i=%d j=%d\\n", i, j);

    /* (4) 函数调用的逗号是「参数分隔符」，不是逗号运算符 */
    printf("%d %d\\n", a, b);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "逗号表达式的值与顺序", text: "a = 1, b = 2, a + b 会依次求值：先 a=1，再 b=2，最后算 a+b=3，整体值就是 3。求值顺序由标准保证是从左到右，且前一个的副作用在下一次求值前完成。" },
        { n: 2, title: "括号决定了值归谁", text: "x = (a = 1, b = 2, a + b) 因为有括号，x 得到 3。如果写成 x = a = 1, b = 2，因为赋值优先级高于逗号，实际是 (x = a = 1), (b = 2)，x 只得到 1。" },
        { n: 3, title: "for 里的逗号很常用", text: "for 的三个部分各只能放一个表达式，用逗号就能塞进多个操作：同时初始化 i 和 j、同时更新 i++ 和 j--。这是逗号运算符最正当的用途。" },
        { n: 4, title: "和参数分隔符的区别", text: "printf(\"%d %d\", a, b) 里的逗号只是「分隔参数」，不是运算符，不构成逗号表达式。区分方法：看它是否在表达式位置产生一个值。" }
      ],
      extra: ["逗号运算符是 C 里优先级最低的运算符，所以经常需要括号。","`(void)(expr1, expr2)` 这种写法可以「只求副作用、丢弃值」，但可读性差。","在宏里用逗号表达式可以让一个宏「做多件事」且仍是一个表达式。"],
      pitfalls: ["把函数参数之间的逗号当成逗号运算符，误以为会按顺序产生一个值。","忘写括号导致赋值只拿到第一个值（`x = a=1, b=2`）。","在声明里误用逗号：`int a, b = 2;` 只给 b 赋了初值，a 仍未初始化。","过度使用逗号表达式牺牲可读性，不如老老实实分几行写。"],
      references: [
        { source: "n1570", topic: "逗号运算符（6.5.17）" },
        { source: "cert-c", topic: "EXP 系列：表达式求值顺序" }
      ],
      related: ["operator-precedence","arithmetic-assignment","for-loop"]
    }

    ,{
      id: "floating-types-detail",
      name: "浮点类型详解（float / double / long double）",
      category: "数据类型",
      aliases: ["浮点类型", "float", "double", "long double", "IEEE754", "单精度", "双精度", "浮点数", "有效数字", "精度"],
      summary: "float 通常 32 位、约 7 位有效数字；double 64 位、约 15~16 位；long double 宽度因平台而异（x86 上常为 80 位）。三者都是二进制浮点，多数十进制小数存不精确。",
      syntax: "float       f = 3.14f;   /* 32 位，约 7 位有效数字 */\ndouble      d = 3.14;    /* 64 位，约 15~16 位 */\nlong double l = 3.14L;   /* 宽度依平台，x86 常见 80 位 */",
      code: `#include <stdio.h>
#include <float.h>

int main(void) {
    /* (1) 三种浮点类型的字节数与有效十进制位数 */
    printf("float:       %zu 字节, 有效位 %d\\n", sizeof(float), FLT_DIG);
    printf("double:      %zu 字节, 有效位 %d\\n", sizeof(double), DBL_DIG);
    printf("long double: %zu 字节, 有效位 %d\\n", sizeof(long double), LDBL_DIG);

    /* (2) 精度差异：float 只能保留约 7 位有效数字 */
    float  f = 1.0f / 3.0f;
    double d = 1.0  / 3.0;
    printf("float  = %.20f\\n", f);
    printf("double = %.20f\\n", d);

    /* (3) 取值范围由指数位决定，float 上限约 3.4e38 */
    printf("FLT_MAX = %e\\n", FLT_MAX);
    printf("DBL_MAX = %e\\n", DBL_MAX);

    /* (4) 有效位数之外的加法会被“吃掉” */
    float big = 1.0e8f;
    printf("1e8f + 1.0f = %.1f\\n", big + 1.0f);  /* 仍是 100000000 */
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "三者到底差在哪", text: "float 用 1 位符号、8 位指数、23 位尾数，共 32 位，能表示约 7 位十进制有效数字，范围约 ±3.4e38。double 用 1+11+52 共 64 位，约 15~16 位有效数字，范围约 ±1.8e308。long double 在 x86 上常是 80 位扩展精度（有效位约 18~19 位），在 ARM 或 MSVC 上可能等同于 double。标准只保证 float ≤ double ≤ long double 的精度次序，不保证具体宽度。" },
        { n: 2, title: "有效数字少意味着什么", text: "1.0f/3.0f 打印 20 位小数，float 版本从第 8 位左右开始就是垃圾数字，double 版本能对到第 16 位。这不是“算错”，而是存储容量不够。需要高精度计算（科学计算、金融）时，选类型前先想清楚需要几位有效数字。" },
        { n: 3, title: "范围由指数位决定", text: "float 的 8 位指数只能表示到约 3.4e38，超过就变成 inf（无穷大）。double 的 11 位指数能到 1.8e308。计算物理量、乘以大常数时，float 很容易溢出成 inf，而 double 不会——这也是默认用 double 的原因之一。" },
        { n: 4, title: "大数加小数会被“吃掉”", text: "1e8f 的有效数字只有 7 位，而 100000001 需要 9 位才能区分，所以 1e8f + 1.0f 仍等于 100000000。这类误差在累加大量数值时尤其危险：如果你把很多很小的数加到一个大数上，小数的贡献会全部丢失。解决方法是先加小值（或使用 Kahan 求和）。" }
      ],
      extra: ["用 `<float.h>` 里的 `FLT_DIG` / `DBL_DIG` / `LDBL_DIG` 查有效十进制位数，比背数字可靠。", "`FLT_EPSILON` 是「1.0 与下一个可表示值之间的差」，常被用作浮点比较的基准容差。", "`printf` 的 `%f` 对应 `double`；`float` 会经过默认参数提升。`scanf` 必须用 `%f` 读 float、`%lf` 读 double、`%Lf` 读 long double。", "字面量后缀：`3.14f` 是 float，`3.14` 是 double，`3.14L` 是 long double。"],
      pitfalls: ["用 `float` 存需要 8 位以上有效数字的量（如经纬度、金额），精度不够。", "`scanf(\"%f\", &d)` 读 double，格式符与类型不匹配，结果未定义。", "以为 `long double` 一定比 `double` 宽——MSVC 上两者相同。", "对大数反复累加小数，小值被“吃掉”，结果偏小。"],
      references: [
        { source: "n1570", topic: "浮点类型的表示范围与精度（5.2.4.2.2）" },
        { source: "cert-list", topic: "FLP 章节：浮点类型与转换" }
      ],
      related: ["float-double", "implicit-conversion", "literal-suffixes", "integer-types-compared"]
    }
    ,{
      id: "float-compare",
      name: "浮点数的比较与容差",
      category: "运算符",
      aliases: ["浮点比较", "epsilon", "容差", "FLT_EPSILON", "浮点判等", "isnan", "isinf", "float compare"],
      summary: "浮点数几乎不能用 == 判等，因为十进制小数在二进制里存不精确。正确做法是判断两数差值是否小于一个与量级相关的容差；还要处理 NaN 和 inf 这两种特殊值。",
      syntax: "#include <math.h>\nfabs(a - b) < eps      /* 绝对误差比较 */\nfabs(a - b) < eps * fabs(b)   /* 相对误差比较，适合数量级跨度大 */",
      code: `#include <stdio.h>
#include <math.h>
#include <float.h>

/* (1) 绝对误差比较：适合数值范围已知且接近 1 的量 */
int nearly_equal(double a, double b, double eps) {
    return fabs(a - b) < eps;
}

int main(void) {
    double x = 0.1 + 0.2;
    double y = 0.3;

    /* (2) 直接判等几乎总是失败 */
    printf("x == y ? %d\\n", x == y);
    printf("x - y  = %.20f\\n", x - y);

    /* (3) 用容差比较：判定为“相等” */
    printf("nearly_equal ? %d\\n", nearly_equal(x, y, 1e-9));

    /* (4) 特殊值：NaN 与任何数比较都为假，包括它自己 */
    double nan = 0.0 / 0.0;
    printf("nan == nan ? %d\\n", nan == nan);
    printf("isnan(nan) ? %d\\n", isnan(nan));

    /* (5) 无穷大可以比较，也可以参与运算 */
    double inf = 1.0 / 0.0;
    printf("inf > DBL_MAX ? %d\\n", inf > DBL_MAX);
    return 0;
}`,
      level: "detailed",
      walkthrough: [
        { n: 1, title: "为什么绝对误差够用", text: "当被比较的量都在 1 附近时，固定一个很小的 eps（如 1e-9）就够了。这种写法简单直观，前提是你知道数值不会太大也不会太小。" },
        { n: 2, title: "直接判等为什么失败", text: "0.1、0.2、0.3 都无法用二进制精确表示，0.1+0.2 实际得到的是 0.30000000000000004，与字面量 0.3 的存储值差约 5.5e-17。两者不相等，但差异极小——这就是必须用容差的原因。" },
        { n: 3, title: "容差怎么选", text: "绝对误差不适合量级跨度大的场景：比较 1e-10 和 1e-10+1e-12 时，eps=1e-9 会把它们判成相等，尽管相对差有 1%。这时应改用相对误差 fabs(a-b) <= eps * fabs(b)，或者组合判断：差值小于绝对容差或相对容差任一满足即算相等。" },
        { n: 4, title: "NaN 的反常行为", text: "NaN 表示“不是一个数”（如 0.0/0.0）。标准规定任何与 NaN 的比较都返回假，包括 nan == nan。所以要判断一个值是不是 NaN，必须用 isnan()，不能写 x == x。" },
        { n: 5, title: "inf 的语义", text: "inf 表示溢出或除以零得到的无穷大。它可以参与比较（inf > 任何有限数），也可以继续运算（inf + 1 = inf，inf - inf = NaN）。用 isinf() 判断，避免让 inf 悄悄传播到最终结果里。" }
      ],
      extra: ["C99 提供 `isnan` / `isinf` / `isfinite` / `signbit`，都在 `<math.h>` 里。", "`-ffast-math` 会让编译器假定不存在 NaN/inf，可能破坏这些判断，调试时别开。", "比较两个浮点数组是否「整体相等」时，常用「最大绝对误差」或「均方误差」作为指标，而不是逐个判等。"],
      pitfalls: ["用 `==` 或 `!=` 直接比较浮点运算结果。", "用固定的极小 eps 比较量级差异很大的数，导致误判。", "用 `x == x` 判断 NaN（永远为假，应该用 `isnan`）。", "忘了 `inf` 会污染后续计算，最后得到 NaN 却找不到源头。"],
      references: [
        { source: "n1570", topic: "浮点比较与 NaN 语义（5.2.4.2.2、6.5.8）" },
        { source: "cert-list", topic: "FLP 章节：浮点比较" }
      ],
      related: ["float-double", "floating-types-detail", "operator-precedence", "implicit-conversion"]
    }
  ];

  global.C_QUICKREF = {
    version: '0.5.0-deepened',
    sources: sources,
    categories: categories,
    entries: entries
  };
})(window);
