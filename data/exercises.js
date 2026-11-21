/* =========================================================================
 * 条目配套练习题 · 每条目 3 题（入门 / 掌握 / 精通）
 * -------------------------------------------------------------------------
 * 用法：在 index.html 与 quiz.html 里用 <script> 引入，挂到 window.C_EXERCISES
 * 结构：
 *   window.C_EXERCISES = {
 *     version: '1.0.0-full',
 *     tiers: { basic: '入门', master: '掌握', expert: '精通' },
 *     byEntry: {
 *       '<条目 id>': [
 *         { id, tier, type, stem, code?, options?, answer, explanation }
 *       ]
 *     }
 *   }
 *
 * 约定：
 *   - type = 'single' → answer 是选项下标（数字）
 *   - type = 'judge'  → answer 是 true / false
 *   - type = 'blank'  → answer 是字符串，acceptable 放可接受的写法
 *   - 每个条目的题目 id 全局唯一，前缀用条目 id 便于排查
 *
 * 题目来源说明：
 *   题目围绕本站各条目的知识点编写，覆盖 PTA / 浙大版《C语言程序设计》
 *   题目集与 Dotcpp 题库中反复出现的经典考点（如 0.1+0.2 判等、
 *   while(i--) 循环次数、数组名不可自增、strcmp 比较、malloc 后判空等）。
 *   未逐题照抄任何平台原题，均为按考点自行表述。
 * ========================================================================= */
(function (global) {
  'use strict';

  var tiers = { basic: '入门', master: '掌握', expert: '精通' };

  var byEntry = {

    /* ---------------- 程序结构 ---------------- */
    'main-function': [
      { id: 'main-function-b1', tier: 'basic', type: 'judge',
        stem: '一个 C 程序可以没有 main 函数，只要写了其他函数就能运行。',
        answer: false,
        explanation: '标准规定程序从 main 开始执行。没有 main 链接会失败，即使其他函数都写对了。' },
      { id: 'main-function-m1', tier: 'master', type: 'single',
        stem: '下面哪个 main 定义符合 C 标准？',
        options: ['void main()', 'int main(void)', 'main()', 'public static void main()'],
        answer: 1,
        explanation: '标准形式是 int main(void) 或 int main(int argc, char *argv[])。void main 是编译器扩展，main() 省略返回类型在 C99 起不合法。' },
      { id: 'main-function-e1', tier: 'expert', type: 'single',
        code: 'int main(int argc, char *argv[]) {\n    printf("%d\\n", argc);\n    return 0;\n}',
        stem: '以 ./app hello world 运行，输出是：',
        options: ['1', '2', '3', '不确定'],
        answer: 2,
        explanation: 'argc 是参数个数，含程序名本身：./app、hello、world 共 3 个，所以输出 3。argv[0] 是程序名。' }
    ],

    'include-header': [
      { id: 'include-header-b1', tier: 'basic', type: 'single',
        stem: '使用 printf 需要包含哪个头文件？',
        options: ['stdlib.h', 'stdio.h', 'string.h', 'math.h'],
        answer: 1,
        explanation: 'printf / scanf / fopen 都在 stdio.h 里声明。' },
      { id: 'include-header-m1', tier: 'master', type: 'single',
        stem: '关于 #include <a.h> 与 #include "a.h"，正确的是：',
        options: [
          '两者完全等价',
          '尖括号只查系统目录，双引号先查当前目录',
          '双引号只能包含系统头文件',
          '尖括号用于 C++，双引号用于 C'
        ],
        answer: 1,
        explanation: '双引号形式会先搜当前源文件所在目录，找不到再查系统目录；尖括号只查系统目录。自己写的头文件用双引号。' },
      { id: 'include-header-e1', tier: 'expert', type: 'judge',
        stem: '同一个 .c 文件里两次 #include "a.h"（a.h 有保护宏），会导致 a.h 的内容被展开两次。',
        answer: false,
        explanation: '保护宏让第二次展开时整个文件被跳过，所以内容只生效一次。这正是保护宏存在的意义。' }
    ],

    /* ---------------- 数据类型 ---------------- */
    'basic-types': [
      { id: 'basic-types-b1', tier: 'basic', type: 'single',
        stem: '在常见的 64 位平台上，sizeof(int) 通常是多少字节？',
        options: ['1', '2', '4', '8'],
        answer: 2,
        explanation: '主流平台 int 是 4 字节。但标准只保证至少 16 位，具体宽度要看平台，用 sizeof 确认。' },
      { id: 'basic-types-m1', tier: 'master', type: 'single',
        stem: '下面哪种类型能存放最大的整数（同平台）？',
        options: ['short', 'int', 'long long', 'char'],
        answer: 2,
        explanation: '按标准保证的范围次序：char ≤ short ≤ int ≤ long ≤ long long，long long 至少 64 位。' },
      { id: 'basic-types-e1', tier: 'expert', type: 'blank',
        stem: '表达式 sizeof(char) 的值在标准 C 中恒为多少？（填数字）',
        answer: '1', acceptable: ['1', '１'],
        explanation: '标准规定 sizeof(char) 恒为 1，这是「字节」的定义。char 的位数则由 CHAR_BIT 给出，不一定是 8。' }
    ],

    'floating-types-detail': [
      { id: 'floating-types-detail-b1', tier: 'basic', type: 'single',
        stem: '不带后缀的小数字面量 3.14 是什么类型？',
        options: ['float', 'double', 'long double', '由赋值目标决定'],
        answer: 1,
        explanation: '不带后缀的浮点字面量默认是 double。要 float 写 3.14f，要 long double 写 3.14L。' },
      { id: 'floating-types-detail-m1', tier: 'master', type: 'single',
        stem: 'float 大约能保证几位十进制有效数字？',
        options: ['3 位', '7 位', '15 位', '19 位'],
        answer: 1,
        explanation: 'float 有 23 位尾数，约 7 位十进制有效数字（FLT_DIG 通常为 6~7）。double 约 15~16 位。' },
      { id: 'floating-types-detail-e1', tier: 'expert', type: 'judge',
        stem: '在 x86 平台上，long double 的精度一定高于 double。',
        answer: true,
        explanation: 'x86 上 long double 通常是 80 位扩展精度，高于 double 的 64 位。但这不是标准保证——MSVC 上 long double 与 double 相同，所以跨平台不能假定。' }
    ],

    'float-compare': [
      { id: 'float-compare-b1', tier: 'basic', type: 'judge',
        stem: '判断两个浮点数是否相等，可以直接用 == 比较。',
        answer: false,
        explanation: '浮点数的十进制小数无法精确表示，运算后常有微小误差，== 往往得到意外的假。应比较差值是否小于容差。' },
      { id: 'float-compare-m1', tier: 'master', type: 'single',
        code: 'double x = 0.1 + 0.2;\nprintf("%d", x == 0.3);',
        stem: '上面代码的输出是：',
        options: ['1', '0', '编译错误', '不确定'],
        answer: 1,
        explanation: '0.1+0.2 实际得到 0.30000000000000004，与 0.3 的存储值不同，比较结果为假，输出 0。' },
      { id: 'float-compare-e1', tier: 'expert', type: 'single',
        stem: '判断一个 double 值是否为 NaN，正确写法是：',
        options: ['x == x', 'x != x', 'x > 0', 'fabs(x) < 0'],
        answer: 1,
        explanation: 'NaN 与任何值比较都为假，包括自己，所以 x != x 为真即表示 NaN。更清晰的写法是用 isnan(x)。' }
    ],

    'sizeof-operator': [
      { id: 'sizeof-operator-b1', tier: 'basic', type: 'single',
        code: 'int a[10];\nprintf("%zu", sizeof(a));',
        stem: '在 int 为 4 字节的平台上，上面输出是：',
        options: ['10', '40', '4', '8'],
        answer: 1,
        explanation: 'sizeof 数组得到整个数组字节数：10 * 4 = 40。注意不是元素个数；元素个数要用 sizeof(a)/sizeof(a[0])。' },
      { id: 'sizeof-operator-m1', tier: 'master', type: 'judge',
        stem: 'sizeof 是一个函数，在运行时才计算。',
        answer: false,
        explanation: 'sizeof 是运算符，结果在编译期就确定（变长数组除外），不产生运行时代价。' },
      { id: 'sizeof-operator-e1', tier: 'expert', type: 'single',
        stem: '在函数 void f(int a[10]) 内部，sizeof(a) 得到的是：',
        options: ['40', '10', '指针大小', '编译错误'],
        answer: 2,
        explanation: '数组作参数会退化成指针，a 的类型是 int*，sizeof(a) 得到指针大小（64 位平台通常 8）。这也是函数必须额外传长度的原因。' }
    ],

    /* ---------------- 变量与常量 ---------------- */
    'static-local-global': [
      { id: 'static-local-global-b1', tier: 'basic', type: 'judge',
        stem: '函数内的 static 局部变量在函数返回后依然保留它的值。',
        answer: true,
        explanation: 'static 局部变量存放在静态存储区，生命周期贯穿整个程序，函数多次调用之间保持上次的值。' },
      { id: 'static-local-global-m1', tier: 'master', type: 'single',
        code: 'void f(void) {\n    static int n = 0;\n    n++;\n    printf("%d ", n);\n}\nint main(void) { f(); f(); f(); }',
        stem: '上面代码的输出是：',
        options: ['1 1 1', '1 2 3', '0 0 0', '3 3 3'],
        answer: 1,
        explanation: 'static 局部变量只初始化一次，之后保留值，所以三次调用依次输出 1、2、3。' },
      { id: 'static-local-global-e1', tier: 'expert', type: 'single',
        stem: '给全局变量加 static，其效果是：',
        options: [
          '让它的值不能被修改',
          '让它只在本翻译单元可见',
          '让它在栈上分配',
          '让它自动初始化为随机值'
        ],
        answer: 1,
        explanation: 'static 修饰全局变量或函数时改变的是链接属性：从外部链接变为内部链接，其他 .c 文件看不到它。这与「静态存储期」是两件事。' }
    ],

    /* ---------------- 运算符 ---------------- */
    'operator-precedence': [
      { id: 'operator-precedence-b1', tier: 'basic', type: 'single',
        stem: '表达式 2 + 3 * 4 的值是：',
        options: ['20', '14', '24', '9'],
        answer: 1,
        explanation: '* 优先级高于 +，先算 3*4=12，再 2+12=14。' },
      { id: 'operator-precedence-m1', tier: 'master', type: 'single',
        code: 'int a = 5;\nprintf("%d", a > 3 && a < 10);',
        stem: '上面输出是：',
        options: ['0', '1', '5', '编译错误'],
        answer: 1,
        explanation: '&& 优先级低于关系运算符，等价于 (a>3) && (a<10)，两个都为真，结果 1。' },
      { id: 'operator-precedence-e1', tier: 'expert', type: 'single',
        stem: '表达式 5 > 3 > 1 的值是：',
        options: ['1', '0', '3', '语法错误'],
        answer: 1,
        explanation: '关系运算符左结合：先算 5>3 得 1，再算 1>1 得 0。数学上的连写比较在 C 里不成立，gcc 会给 -Wparentheses 警告。' }
    ],

    /* ---------------- 控制结构 ---------------- */
    'for-loop': [
      { id: 'for-loop-b1', tier: 'basic', type: 'blank',
        code: 'int s = 0;\nfor (int i = 1; i <= 5; i++) s += i;',
        stem: '上面代码执行后 s 的值是？（填数字）',
        answer: '15', acceptable: ['15', '１５'],
        explanation: '1+2+3+4+5 = 15。' },
      { id: 'for-loop-m1', tier: 'master', type: 'single',
        code: 'int n = 0;\nfor (int i = 1; i < 10; i += 3) n++;',
        stem: '循环体执行了几次？',
        options: ['2', '3', '4', '9'],
        answer: 1,
        explanation: 'i 依次为 1、4、7，下一次 10 不满足 i<10，共 3 次。' },
      { id: 'for-loop-e1', tier: 'expert', type: 'single',
        code: 'for (int i = 0, j = 10; i = j = 10; i++, j--) { }',
        stem: '这个循环会执行多少次？',
        options: ['1 次', '10 次', '无限次', '编译错误'],
        answer: 2,
        explanation: '条件写成赋值 i = j = 10，表达式的值恒为 10（非 0 即真），与 i++、j-- 无关，循环永不结束。写 i == j 才是比较。' }
    ],

    'while-do-while': [
      { id: 'while-do-while-b1', tier: 'basic', type: 'single',
        code: 'int i = 10;\nwhile (i < 5) { printf("A"); i++; }',
        stem: '上面代码会输出几个 A？',
        options: ['0 个', '1 个', '5 个', '无限个'],
        answer: 0,
        explanation: 'while 先判断条件，10 < 5 为假，循环体一次都不执行。' },
      { id: 'while-do-while-m1', tier: 'master', type: 'single',
        code: 'int i = 10;\ndo { printf("A"); i++; } while (i < 5);',
        stem: '上面代码会输出几个 A？',
        options: ['0 个', '1 个', '5 个', '无限个'],
        answer: 1,
        explanation: 'do-while 先执行一次再判断，所以即使条件一开始为假，循环体也执行了 1 次。' },
      { id: 'while-do-while-e1', tier: 'expert', type: 'blank',
        code: 'int i = 5, s = 0;\nwhile (i--) {\n    if (i % 2) continue;\n    else s += i;\n}',
        stem: '循环结束后 s 的值是？（填数字）',
        answer: '6', acceptable: ['6', '６'],
        explanation: 'i-- 先取值再自减，进入循环体时 i 依次为 4、3、2、1、0；奇数被 continue 跳过，偶数累加 4+2+0=6。' }
    ],

    'if-else': [
      { id: 'if-else-b1', tier: 'basic', type: 'single',
        code: 'int x = 5;\nif (x = 0) printf("A"); else printf("B");',
        stem: '上面代码输出：',
        options: ['A', 'B', 'AB', '编译错误'],
        answer: 1,
        explanation: 'if (x = 0) 是赋值不是比较，x 被赋为 0，条件为假，走 else 输出 B。这类错误编译器通常只给警告。' },
      { id: 'if-else-m1', tier: 'master', type: 'single',
        stem: '关于 if-else if 链，正确的是：',
        options: [
          '所有分支都会被依次执行',
          '最多只有一个分支被执行',
          '没有 else 时一定会报错',
          'else 必须带条件'
        ],
        answer: 1,
        explanation: 'if-else if 链从上到下判断，命中第一个为真的分支后其余全部跳过，所以最多执行一个分支。' },
      { id: 'if-else-e1', tier: 'expert', type: 'single',
        code: 'int a = 1;\nif (a == 1)\n    if (a == 2) printf("X");\nelse printf("Y");',
        stem: '上面代码输出：',
        options: ['X', 'Y', '什么都不输出', 'XY'],
        answer: 1,
        explanation: 'else 与最近的未配对 if 结合，即与内层 if (a == 2) 配对。外层 a==1 为真，进入内层判断 a==2 为假，于是执行配套的 else，输出 Y。这种「悬挂 else」要靠大括号消除歧义。' }
    ],

    'switch-case': [
      { id: 'switch-case-b1', tier: 'basic', type: 'single',
        code: 'int x = 2;\nswitch (x) {\n    case 1: printf("A"); break;\n    case 2: printf("B"); break;\n    default: printf("C");\n}',
        stem: '上面输出：',
        options: ['A', 'B', 'C', 'BC'],
        answer: 1,
        explanation: 'x 等于 2，命中 case 2，打印 B 后 break 跳出。' },
      { id: 'switch-case-m1', tier: 'master', type: 'single',
        code: 'int x = 1;\nswitch (x) {\n    case 1: printf("A");\n    case 2: printf("B"); break;\n    default: printf("C");\n}',
        stem: '上面输出：',
        options: ['A', 'AB', 'ABC', 'B'],
        answer: 1,
        explanation: 'case 1 没有 break，执行完 A 后继续「贯穿」到 case 2，打印 B 才遇到 break。输出 AB。' },
      { id: 'switch-case-e1', tier: 'expert', type: 'judge',
        stem: 'switch 的控制表达式可以是 double 类型。',
        answer: false,
        explanation: 'switch 的控制表达式必须是整型（含 char、枚举），case 标签必须是整型常量表达式。浮点类型不允许。' }
    ],

    /* ---------------- 函数 ---------------- */
    'function-prototype': [
      { id: 'function-prototype-b1', tier: 'basic', type: 'judge',
        stem: '函数必须先定义再使用，否则一定编译失败。',
        answer: false,
        explanation: '只要有函数原型（声明）就能先调用，定义可以放在后面甚至别的文件里。定义只需在链接时存在。' },
      { id: 'function-prototype-m1', tier: 'master', type: 'single',
        stem: '函数返回值的类型由什么决定？',
        options: ['return 语句中表达式的类型', '调用者的类型', '函数定义时声明的返回类型', '运行时决定'],
        answer: 2,
        explanation: '返回类型在定义/声明时固定，return 后的表达式会被隐式转换成该类型。' },
      { id: 'function-prototype-e1', tier: 'expert', type: 'single',
        stem: '一个 return 语句能返回几个值给调用者？',
        options: ['1 个', '2 个', '任意多个', '取决于参数个数'],
        answer: 0,
        explanation: 'C 的 return 只能返回一个值。想返回多个值要用指针参数、结构体，或返回结构体。' }
    ],

    'pass-by-value': [
      { id: 'pass-by-value-b1', tier: 'basic', type: 'single',
        code: 'void f(int x) { x = 100; }\nint main(void) { int a = 1; f(a); printf("%d", a); }',
        stem: '上面输出：',
        options: ['1', '100', '101', '编译错误'],
        answer: 0,
        explanation: 'C 只有值传递，f 收到的是 a 的副本，改副本不影响 a，所以仍输出 1。' },
      { id: 'pass-by-value-m1', tier: 'master', type: 'single',
        stem: '要让函数修改调用者的变量，应该传：',
        options: ['变量本身', '变量的副本', '变量的地址', '变量的类型'],
        answer: 2,
        explanation: '传地址（指针）后，函数通过解引用改写原变量。这是 C 模拟「引用传递」的标准做法。' },
      { id: 'pass-by-value-e1', tier: 'expert', type: 'judge',
        stem: '数组作为函数参数时，传递的是整个数组的副本。',
        answer: false,
        explanation: '数组名会退化成指向首元素的指针，函数收到的是地址而非副本。所以在函数里改数组元素会影响调用者。' }
    ],

    /* ---------------- 数组与字符串 ---------------- */
    'string-null-terminator': [
      { id: 'string-null-terminator-b1', tier: 'basic', type: 'blank',
        code: 'char s[] = "abc";',
        stem: '数组 s 占多少个字节？（填数字）',
        answer: '4', acceptable: ['4', '４'],
        explanation: '字符串字面量 "abc" 含 3 个字符加 1 个结尾的 \\0，共 4 字节。' },
      { id: 'string-null-terminator-m1', tier: 'master', type: 'single',
        code: 'char s[5] = "hello";',
        stem: '上面代码的问题是：',
        options: ['没有 \\0 结尾', '数组太小，没有空间放 \\0', '不能对数组初始化', '没有问题'],
        answer: 1,
        explanation: '"hello" 需要 6 个字节（5 字符 + \\0），s 只有 5 个，结尾的 \\0 放不下，s 不是合法字符串。' },
      { id: 'string-null-terminator-e1', tier: 'expert', type: 'single',
        code: 'char a[] = "abc";\nchar b[] = "abc";\nprintf("%d", a == b);',
        stem: '上面输出：',
        options: ['1', '0', '编译错误', '不确定'],
        answer: 1,
        explanation: 'a 和 b 是两个不同的数组，各自有独立地址。比较数组名比的是地址而非内容，结果为假，输出 0。比内容要用 strcmp。' }
    ],

    /* ---------------- 指针 ---------------- */
    'pointer-deref': [
      { id: 'pointer-deref-b1', tier: 'basic', type: 'single',
        code: 'int x = 5;\nint *p = &x;\nprintf("%d", *p);',
        stem: '上面输出：',
        options: ['5', 'x 的地址', '0', '编译错误'],
        answer: 0,
        explanation: 'p 保存 x 的地址，*p 就是 x 本身，输出 5。' },
      { id: 'pointer-deref-m1', tier: 'master', type: 'single',
        stem: '若 p 已指向变量 x，(*p)++ 相当于：',
        options: ['p++', 'x++', '*(p++)', '&x++'],
        answer: 1,
        explanation: '(*p) 就是 x，(*p)++ 等价于 x++。而 *(p++) 是「指针后移再解引用」，含义完全不同。' },
      { id: 'pointer-deref-e1', tier: 'expert', type: 'single',
        code: 'int x = 5;\nint *p = &x;\nint *q = p;\n*q = 9;',
        stem: '执行后 x 的值是：',
        options: ['5', '9', '0', '未定义'],
        answer: 1,
        explanation: 'q 复制的是 p 的地址值，两个指针指向同一个 x。通过 *q 赋值就是改 x，所以 x 变成 9。' }
    ],

    'array-vs-pointer': [
      { id: 'array-vs-pointer-b1', tier: 'basic', type: 'judge',
        stem: '数组名可以像指针一样自增，例如 a++。',
        answer: false,
        explanation: '数组名是不可修改的左值，a++ 编译报错。指针变量才能自增。' },
      { id: 'array-vs-pointer-m1', tier: 'master', type: 'single',
        code: 'int a[5];\nint *p = a;\nprintf("%d", (int)(p - a));',
        stem: '上面输出：',
        options: ['0', '1', '4', '地址差'],
        answer: 0,
        explanation: 'p 和 a 指向同一个元素，指针相减得到元素个数差，即 0。注意单位是元素而不是字节。' },
      { id: 'array-vs-pointer-e1', tier: 'expert', type: 'single',
        code: 'int a[5] = {1,2,3,4,5};\nprintf("%d", *(a + 2));',
        stem: '上面输出：',
        options: ['1', '2', '3', '地址'],
        answer: 2,
        explanation: 'a+2 指向下标 2 的元素，解引用得到 a[2] = 3。a[i] 本质就是 *(a+i)。' }
    ],

    /* ---------------- 复合类型 ---------------- */
    'struct-type': [
      { id: 'struct-type-b1', tier: 'basic', type: 'single',
        stem: '访问结构体指针 p 的成员 x，正确写法是：',
        options: ['p.x', 'p->x', '*p.x', 'p::x'],
        answer: 1,
        explanation: '指针用 ->；变量用 .。p->x 等价于 (*p).x。' },
      { id: 'struct-type-m1', tier: 'master', type: 'judge',
        stem: '两个结构体变量可以直接用 == 比较是否相等。',
        answer: false,
        explanation: 'C 不支持结构体直接比较，要逐成员比较。用 memcmp 也不可靠，因为填充字节里是垃圾值。' },
      { id: 'struct-type-e1', tier: 'expert', type: 'single',
        stem: '结构体大小通常大于各成员大小之和，原因是：',
        options: ['编译器预留了空间', '成员之间存在对齐填充字节', '结构体有隐藏头部', '必须先初始化'],
        answer: 1,
        explanation: '为了让每个成员落在对齐边界上，编译器会插入填充字节，因此结构体往往比成员之和更大。调整成员顺序可以减少填充。' }
    ],

    /* ---------------- 内存管理 ---------------- */
    'malloc-free': [
      { id: 'malloc-free-b1', tier: 'basic', type: 'judge',
        stem: 'malloc 申请的内存需要用 free 释放，否则会造成内存泄漏。',
        answer: true,
        explanation: '堆内存的生命周期由程序员管理，不 free 就一直占用，直到进程结束。' },
      { id: 'malloc-free-m1', tier: 'master', type: 'single',
        stem: 'malloc 失败时返回什么？',
        options: ['0 地址', 'NULL', '-1', '随机地址'],
        answer: 1,
        explanation: '内存不足时返回 NULL。所以每次 malloc 后都应该检查是否为 NULL 再使用。' },
      { id: 'malloc-free-e1', tier: 'expert', type: 'single',
        code: 'int *p = malloc(10 * sizeof(int));\nfree(p);\nfree(p);',
        stem: '上面代码的问题是：',
        options: ['内存泄漏', '重复释放同一指针', '数组越界', '没有检查 NULL'],
        answer: 1,
        explanation: '对同一块内存 free 两次是未定义行为，会破坏堆结构。free 后应立刻把指针置 NULL，而 free(NULL) 是安全的空操作。' }
    ],

    /* ---------------- 文件 I/O ---------------- */
    'fopen-modes': [
      { id: 'fopen-modes-b1', tier: 'basic', type: 'single',
        stem: '以只读方式打开文本文件，应使用哪个模式？',
        options: ['"w"', '"r"', '"a"', '"rb+"'],
        answer: 1,
        explanation: '"r" 是只读文本模式，文件必须已存在，否则 fopen 返回 NULL。' },
      { id: 'fopen-modes-m1', tier: 'master', type: 'single',
        stem: '关于 "w" 模式，正确的是：',
        options: [
          '文件不存在则报错',
          '文件已存在则清空内容',
          '在文件末尾追加内容',
          '只能读不能写'
        ],
        answer: 1,
        explanation: '"w" 会创建或截断文件：不存在就新建，已存在则内容被清空。想追加要用 "a"。' },
      { id: 'fopen-modes-e1', tier: 'expert', type: 'judge',
        stem: '以 "r" 模式打开不存在的文件时，fopen 返回 NULL 并设置 errno。',
        answer: true,
        explanation: '这是标准行为。所以必须检查返回值，并用 perror 或 strerror(errno) 查看原因。' }
    ],

    'fgets-line': [
      { id: 'fgets-line-b1', tier: 'basic', type: 'single',
        stem: 'fgets(buf, sizeof buf, fp) 最多读入多少个字符（不含结尾 \\0）？',
        options: ['sizeof buf', 'sizeof buf - 1', 'sizeof buf + 1', '1'],
        answer: 1,
        explanation: 'fgets 最多读 n-1 个字符，留一个位置给 \\0。所以传 sizeof buf 是正确用法。' },
      { id: 'fgets-line-m1', tier: 'master', type: 'judge',
        stem: 'fgets 会把换行符 \\n 一起读入缓冲区（如果空间够）。',
        answer: true,
        explanation: 'fgets 会保留换行符。如果不需要，通常要手动去掉：buf[strcspn(buf, "\\n")] = 0;' },
      { id: 'fgets-line-e1', tier: 'expert', type: 'single',
        stem: '用 while (!feof(fp)) { fgets(...); } 读文件的问题是：',
        options: [
          '无法读取二进制文件',
          '最后一次循环会处理无效数据',
          'fgets 不能与 feof 一起用',
          '会导致内存泄漏'
        ],
        answer: 1,
        explanation: 'feof 只有在「尝试读并失败」之后才为真，所以循环会多跑一次，处理到无效内容。正确做法是直接用 fgets 的返回值作为循环条件。' }
    ],

    /* ---------------- 预处理与宏 ---------------- */
    'define-macro': [
      { id: 'define-macro-b1', tier: 'basic', type: 'single',
        stem: '#define MAX 100 中，MAX 是什么？',
        options: ['一个 int 变量', '一个预处理宏，编译前被替换成 100', '一个常量指针', '一个函数'],
        answer: 1,
        explanation: '#define 是纯文本替换，编译前 MAX 就被替换成 100，没有类型、没有地址。' },
      { id: 'define-macro-m1', tier: 'master', type: 'single',
        code: '#define SQUARE(x) x * x\nint r = SQUARE(2 + 3);',
        stem: 'r 的值是：',
        options: ['25', '11', '10', '编译错误'],
        answer: 1,
        explanation: '宏是文本替换：变成 2 + 3 * 2 + 3 = 2+6+3 = 11。必须给参数加括号：#define SQUARE(x) ((x)*(x))。' },
      { id: 'define-macro-e1', tier: 'expert', type: 'judge',
        stem: '#define 定义的宏会占用存储空间，可以通过 & 取地址。',
        answer: false,
        explanation: '宏只是文本替换，没有存储空间，不能取地址。需要地址和类型就用 const 变量或 enum。' }
    ],
    /* ---- compile-link ---- */
    'compile-link': [
      { id: 'compile-link-b1', tier: 'basic', type: 'single',
            stem: "把 .c 源码变成可执行文件，正确的顺序是：",
            options: ["编译 → 预处理 → 链接","预处理 → 编译 → 链接","链接 → 编译 → 预处理","预处理 → 链接 → 编译"],
            answer: 1,
            explanation: "先预处理（展开宏与 #include），再编译成目标文件，最后链接成可执行文件。每一步出错的原因完全不同。" },
      { id: 'compile-link-m2', tier: 'master', type: 'single',
            stem: "编译单个 .c 文件但不链接，应使用哪个选项？",
            options: ["-E","-c","-o","-l"],
            answer: 1,
            explanation: "-c 表示编译并汇编，但不链接，产出 .o 目标文件。-E 只做预处理，-o 指定输出名，-l 指定库。" },
      { id: 'compile-link-e3', tier: 'expert', type: 'single',
            stem: "代码里调用了某个函数，编译器通过但链接时报 undefined reference，最可能的原因是：",
            options: ["函数名拼写错误","函数只有声明没有定义，或定义所在的 .c 没参与编译","缺少分号","返回类型不匹配"],
            answer: 1,
            explanation: "编译只需声明，链接才需要定义。所以「未定义的引用」几乎总是漏了定义、漏了某个 .c 文件，或没链接对应库——不是语法问题。" }
    ],

    /* ---- multi-file ---- */
    'multi-file': [
      { id: 'multi-file-b1', tier: 'basic', type: 'judge',
            stem: "头文件里通常只放声明，函数体等定义放在 .c 文件里。",
            answer: true,
            explanation: "头文件会被多个 .c 包含，若放定义，多个翻译单元各有一份，链接时报重复定义。" },
      { id: 'multi-file-m2', tier: 'master', type: 'single',
            stem: "头文件的保护宏写成 #ifndef STACK_H，它的作用是：",
            options: ["防止宏名冲突","让同一翻译单元内重复包含时只展开一次","加快编译速度","防止函数被外部调用"],
            answer: 1,
            explanation: "第一次包含时定义 STACK_H，第二次包含时 #ifndef 判断为假，整个文件被跳过，从而只展开一次。" },
      { id: 'multi-file-e3', tier: 'expert', type: 'single',
            stem: "要让某个全局变量在多个 .c 之间共享，正确做法是：",
            options: ["在头文件里写 int g_count = 0;","在头文件里写 extern int g_count;，在某个 .c 里写 int g_count = 0;","在每个 .c 里都写 int g_count = 0;","在头文件里写 static int g_count;"],
            answer: 1,
            explanation: "extern 是声明，不分配空间；真正的定义只在一处。这样多个文件共享同一个变量，符合单一定义规则。" }
    ],

    /* ---- typedef-alias ---- */
    'typedef-alias': [
      { id: 'typedef-alias-b1', tier: 'basic', type: 'single',
            stem: "typedef unsigned long ulong; 之后，ulong 是：",
            options: ["一个变量","unsigned long 的别名","一个宏","一个函数"],
            answer: 1,
            explanation: "typedef 给已有类型起别名，不创建新类型。ulong 与 unsigned long 完全等价。" },
      { id: 'typedef-alias-m2', tier: 'master', type: 'judge',
            stem: "typedef 定义的是一个新类型，与原有类型不兼容。",
            answer: false,
            explanation: "typedef 只是别名，不产生新类型。typedef int myint; 之后 myint 就是 int，可以自由互换。" },
      { id: 'typedef-alias-e3', tier: 'expert', type: 'single',
            stem: "typedef struct { int x; } Point; 与 struct Point { int x; }; 的区别是：",
            options: ["没有区别","前者 Point 是类型别名，可直接写 Point p;；后者必须写 struct Point p;","后者不能使用","前者会分配内存"],
            answer: 1,
            explanation: "typedef 把匿名结构体命名为 Point，之后直接写 Point p;。而 struct Point {...} 只定义了标签，类型名仍需带 struct 关键字。" }
    ],

    /* ---- integer-types-compared ---- */
    'integer-types-compared': [
      { id: 'integer-types-compared-b1', tier: 'basic', type: 'judge',
            stem: "int 在所有平台上都一定是 4 字节。",
            answer: false,
            explanation: "标准只保证 int 至少 16 位，不规定字节数。主流平台是 4 字节，但要看具体实现，用 sizeof 确认。" },
      { id: 'integer-types-compared-m2', tier: 'master', type: 'single',
            stem: "关于 short / int / long / long long 的宽度，标准保证的是：",
            options: ["都在 2~8 字节之间","short ≤ int ≤ long ≤ long long 的相对次序与最小范围","每个类型的确切字节数","long 一定是 8 字节"],
            answer: 1,
            explanation: "标准仅规定最小范围和相对次序，具体宽度由实现决定。需要确定宽度时用 <stdint.h> 的 int32_t 等。" },
      { id: 'integer-types-compared-e3', tier: 'expert', type: 'single',
            stem: "要写跨平台且宽度确定的整数，应使用：",
            options: ["int","long","int32_t（<stdint.h>）","short"],
            answer: 2,
            explanation: "int32_t 等固定宽度类型保证恰好 32 位（若平台支持）。int/long 的宽度随平台变化，不适合二进制格式或网络协议。" }
    ],

    /* ---- signed-unsigned ---- */
    'signed-unsigned': [
      { id: 'signed-unsigned-b1', tier: 'basic', type: 'judge',
            stem: "unsigned int 不能表示负数。",
            answer: true,
            explanation: "unsigned 类型只表示非负值，把负数赋给 unsigned 会发生模运算回绕，得到很大的正数。" },
      { id: 'signed-unsigned-m2', tier: 'master', type: 'single',
            stem: "在 32 位 unsigned int 平台上，(unsigned)(-1) 的值是：",
            options: ["-1","0","4294967295","未定义"],
            answer: 2,
            explanation: "标准规定负值转无符号时按 2^n 取模，-1 变成 2^32-1 = 4294967295。这是明确定义的行为，不是未定义。" },
      { id: 'signed-unsigned-e3', tier: 'expert', type: 'single',
            stem: "int a = -1; unsigned int b = 1; 则 a > b 的结果是：",
            options: ["真","假","未定义","编译错误"],
            answer: 0,
            explanation: "有符号与无符号混合运算时，int 会被转成 unsigned，-1 变成 4294967295，远大于 1，所以比较结果为真。这是经典陷阱。" }
    ],

    /* ---- float-double ---- */
    'float-double': [
      { id: 'float-double-b1', tier: 'basic', type: 'single',
            stem: "float f = 3.14; 相比 float f = 3.14f; 的问题是：",
            options: ["没有区别","3.14 是 double，赋给 float 会发生精度收窄","3.14f 语法错误","double 不能赋给 float"],
            answer: 1,
            explanation: "不带后缀的小数字面量是 double。赋给 float 会做一次 double→float 的转换，损失精度，编译器在 -Wconversion 下会警告。" },
      { id: 'float-double-m2', tier: 'master', type: 'single',
            stem: "用 scanf 读入 double 变量 d，正确的格式符是：",
            options: ["%f","%lf","%Lf","%d"],
            answer: 1,
            explanation: "scanf 必须区分类型：%f 读 float，%lf 读 double，%Lf 读 long double。用错格式符是未定义行为。注意 printf 不同，%f 对应 double 即可。" },
      { id: 'float-double-e3', tier: 'expert', type: 'judge',
            stem: "在 MSVC 上，long double 的精度与 double 相同。",
            answer: true,
            explanation: "MSVC 把 long double 实现为与 double 相同的 64 位类型。而 x86 上的 GCC 通常用 80 位扩展精度。所以不能假定 long double 一定更精确。" }
    ],

    /* ---- char-variants ---- */
    'char-variants': [
      { id: 'char-variants-b1', tier: 'basic', type: 'single',
            stem: "char 类型在 C 中本质上存储的是：",
            options: ["一个字符","一个整数编码值","一个字符串","一个比特"],
            answer: 1,
            explanation: "char 存的是整数编码值（通常是 ASCII）。'A' 就是 65。用 %c 打印显示字符，用 %d 打印显示编码值。" },
      { id: 'char-variants-m2', tier: 'master', type: 'single',
            stem: "关于 char、signed char、unsigned char，正确的是：",
            options: ["三者完全等价","char 是否有符号由实现决定","char 一定是有符号的","unsigned char 不能存负数字符"],
            answer: 1,
            explanation: "标准把 char 的符号性交给实现决定。signed char 和 unsigned char 是明确的。处理字节数据时应显式用 unsigned char。" },
      { id: 'char-variants-e3', tier: 'expert', type: 'single',
            stem: "用 unsigned char 处理二进制字节（而非 char）的主要原因是：",
            options: ["unsigned char 更快","避免字节值 ≥128 时被当作负数，导致比较和提升出错","char 不能存数据","unsigned char 占用更少空间"],
            answer: 1,
            explanation: "若 char 有符号，字节 0xFF 会变成 -1，参与比较或转 int 时得到意外结果。用 unsigned char 保证 0~255 的解释。" }
    ],

    /* ---- literal-suffixes ---- */
    'literal-suffixes': [
      { id: 'literal-suffixes-b1', tier: 'basic', type: 'single',
            stem: "常量 012 的十进制值是：",
            options: ["12","10","18","127"],
            answer: 1,
            explanation: "以 0 开头表示八进制，012 = 1×8 + 2 = 10。别用前导零写十进制数。" },
      { id: 'literal-suffixes-m2', tier: 'master', type: 'single',
            stem: "以下哪个不是合法的整型常量？",
            options: ["12L","0x1F","2,900","012"],
            answer: 2,
            explanation: "2,900 里的逗号不是数字的一部分，C 不允许千位分隔符。12L 是 long，0x1F 是十六进制，012 是八进制（均合法）。" },
      { id: 'literal-suffixes-e3', tier: 'expert', type: 'single',
            stem: "在 C 语言中，029 是：",
            options: ["八进制数","十进制数","十六进制数","非法常量"],
            answer: 3,
            explanation: "前导 0 表示八进制，但八进制只允许 0~7，出现 9 就是非法整型常量，编译报错。" }
    ],

    /* ---- implicit-conversion ---- */
    'implicit-conversion': [
      { id: 'implicit-conversion-b1', tier: 'basic', type: 'single',
            stem: "double x = 10 / 4; 之后 x 的值是：",
            options: ["2.5","2.0","2","3"],
            answer: 1,
            explanation: "10 和 4 都是 int，先做整数除法得 2，再转成 double 赋给 x，所以是 2.0。要得 2.5 必须写 10.0/4。" },
      { id: 'implicit-conversion-m2', tier: 'master', type: 'judge',
            stem: "强制类型转换 (double)10/4 能得到 2.5。",
            answer: true,
            explanation: "(double)10 先把 10 转成 10.0，再与 4 相除时 4 也被提升为 double，得到 2.5。(double)(10/4) 就不一样了，会得到 2.0。" },
      { id: 'implicit-conversion-e3', tier: 'expert', type: 'single',
            stem: "int 与 unsigned int 混合运算时，int 会被转换成：",
            options: ["long","unsigned int","double","保持不变"],
            answer: 1,
            explanation: "按「寻常算术转换」，有符号与同等级无符号混合时，有符号被转为无符号。这就是 -1 > 1u 为真的原因。" }
    ],

    /* ---- void-type ---- */
    'void-type': [
      { id: 'void-type-b1', tier: 'basic', type: 'single',
            stem: "void 表示：",
            options: ["空指针","无类型","整数 0","默认类型"],
            answer: 1,
            explanation: "void 是「无类型」。函数返回 void 表示不返回值，参数写 void 表示不接受参数。void* 才是通用指针。" },
      { id: 'void-type-m2', tier: 'master', type: 'judge',
            stem: "可以声明 void 类型的变量。",
            answer: false,
            explanation: "void 是不完整类型，无法确定大小，不能声明变量。可以声明 void* 指针，因为指针大小固定。" },
      { id: 'void-type-e3', tier: 'expert', type: 'single',
            stem: "int f(void); 与 int f(); 的区别是：",
            options: ["没有区别","f(void) 明确表示不接受参数；f() 表示参数未指定（旧式声明）","f() 语法错误","f(void) 返回 void"],
            answer: 1,
            explanation: "f(void) 明确无参；f() 在 C 中表示「参数列表未指定」，仍可传入实参而不被检查。现代代码应写 f(void)。" }
    ],

    /* ---- enum-type ---- */
    'enum-type': [
      { id: 'enum-type-b1', tier: 'basic', type: 'single',
            stem: "enum Color { RED, GREEN, BLUE }; 中 GREEN 的值是：",
            options: ["0","1","2","未定义"],
            answer: 1,
            explanation: "枚举默认从 0 开始递增：RED=0、GREEN=1、BLUE=2。可以显式指定初值改变起点。" },
      { id: 'enum-type-m2', tier: 'master', type: 'single',
            stem: "enum E { A = 5, B, C }; 中 C 的值是：",
            options: ["0","5","6","7"],
            answer: 3,
            explanation: "B 接续 A 得 6，C 再接续得 7。未显式赋值的枚举成员取前一个值加 1。" },
      { id: 'enum-type-e3', tier: 'expert', type: 'judge',
            stem: "枚举类型在 C 中的底层类型一定是 int。",
            answer: false,
            explanation: "C 标准说枚举的底层类型是实现定义的整型，只要能容纳所有值即可，不一定是 int。C++ 可以显式指定底层类型，C 不行。" }
    ],

    /* ---- bool-stdbool ---- */
    'bool-stdbool': [
      { id: 'bool-stdbool-b1', tier: 'basic', type: 'single',
            stem: "使用 bool、true、false 需要包含哪个头文件？",
            options: ["stdbool.h","stdio.h","stdlib.h","stdint.h"],
            answer: 0,
            explanation: "stdbool.h 定义了 bool（即 _Bool）、true、false 三个宏。C99 起可用。" },
      { id: 'bool-stdbool-m2', tier: 'master', type: 'single',
            stem: "把任意非零整数赋给 _Bool 变量，结果是：",
            options: ["原值","1","-1","未定义"],
            answer: 1,
            explanation: "标准规定任何非零值赋给 _Bool 都变成 1，0 保持 0。所以布尔值只有 0 和 1。" },
      { id: 'bool-stdbool-e3', tier: 'expert', type: 'judge',
            stem: "在 C 中，if 语句的条件必须是 bool 类型。",
            answer: false,
            explanation: "C 中任何标量（整数、浮点、指针）都能作条件，非零为真。bool 只是为了表意清晰，不是语法要求。" }
    ],

    /* ---- stdint-fixed-width ---- */
    'stdint-fixed-width': [
      { id: 'stdint-fixed-width-b1', tier: 'basic', type: 'single',
            stem: "int32_t 保证的是：",
            options: ["至少 32 位","恰好 32 位（若平台支持）","最多 32 位","32 个字节"],
            answer: 1,
            explanation: "int32_t 是无符号/有符号的固定宽度类型，恰好 32 位。若平台没有 32 位整型，该类型就不会定义。" },
      { id: 'stdint-fixed-width-m2', tier: 'master', type: 'single',
            stem: "要表示「指针大小」的整数，应使用：",
            options: ["int","long","intptr_t","short"],
            answer: 2,
            explanation: "intptr_t / uintptr_t 保证能装下指针值。int 和 long 在 32/64 位平台上宽度不同，不安全。" },
      { id: 'stdint-fixed-width-e3', tier: 'expert', type: 'single',
            stem: "打印 int64_t 变量，最可移植的格式符是：",
            options: ["%d","%ld","%lld","PRId64（<inttypes.h>）"],
            answer: 3,
            explanation: "int64_t 在不同平台可能是 long 或 long long，直接用 %ld 或 %lld 都有风险。PRId64 宏会展开成正确的格式符。" }
    ],

    /* ---- generic-selection ---- */
    'generic-selection': [
      { id: 'generic-selection-b1', tier: 'basic', type: 'single',
            stem: "_Generic 的作用是：",
            options: ["生成随机数","在编译期按表达式的类型选择不同表达式","类型转换","定义泛型函数"],
            answer: 1,
            explanation: "_Generic 是 C11 特性，编译期根据控制表达式的类型，从关联列表里选出对应表达式，常用于写类型安全的宏。" },
      { id: 'generic-selection-m2', tier: 'master', type: 'single',
            stem: "_Generic(x, int: 1, double: 2, default: 0) 中，若 x 是 float，结果是：",
            options: ["1","2","0","编译错误"],
            answer: 2,
            explanation: "float 不匹配 int 也不匹配 double，落到 default 分支，结果为 0。注意不会发生隐式类型转换匹配。" },
      { id: 'generic-selection-e3', tier: 'expert', type: 'judge',
            stem: "_Generic 的各个分支都会在运行期被求值，只是结果被丢弃。",
            answer: false,
            explanation: "_Generic 在编译期就选定一个分支，其他分支根本不会求值（但仍需通过语法和类型检查）。它是编译期机制，没有运行期开销。" }
    ],
    /* ---- function-pointer ---- */
    'function-pointer': [
      { id: 'function-pointer-b1', tier: 'basic', type: 'single',
            stem: "int (*fp)(int, int); 声明的是：",
            options: ["返回指针的函数","指向「接收两个 int 返回 int 的函数」的指针","int 数组","两个 int 参数"],
            answer: 1,
            explanation: "fp 是指针，指向函数，该函数接收两个 int 返回 int。括号不能省，否则 int *fp(int,int) 变成返回指针的函数。" },
      { id: 'function-pointer-m2', tier: 'master', type: 'single',
            stem: "若 fp 指向函数 add，调用它的正确写法是：",
            options: ["fp(1, 2) 和 (*fp)(1, 2) 都可以","只能写 (*fp)(1, 2)","只能写 fp(1, 2)","fp->(1, 2)"],
            answer: 0,
            explanation: "函数指针可以像函数名一样直接调用，(*fp)(1,2) 也等价。前者更常用。" },
      { id: 'function-pointer-e3', tier: 'expert', type: 'single',
            stem: "用函数指针数组实现「菜单选择」的核心写法是：",
            options: ["switch 里写 5 个 case","int (*ops[5])(int,int) = {add, sub, mul, div_, mod}; 然后 ops[choice](a, b)","用 if-else 链","用 goto"],
            answer: 1,
            explanation: "函数指针数组把「选择」变成「下标」，避免长串 if-else 或 switch，扩展时只需往数组里加函数。" }
    ],

    /* ---- variadic-functions ---- */
    'variadic-functions': [
      { id: 'variadic-functions-b1', tier: 'basic', type: 'single',
            stem: "定义变长参数函数需要包含哪个头文件？",
            options: ["stdio.h","stdarg.h","stdlib.h","string.h"],
            answer: 1,
            explanation: "stdarg.h 提供 va_list、va_start、va_arg、va_end 四个宏。" },
      { id: 'variadic-functions-m2', tier: 'master', type: 'single',
            stem: "变长参数函数至少需要几个固定参数？",
            options: ["0 个","1 个","2 个","任意"],
            answer: 1,
            explanation: "va_start 需要最后一个具名参数来确定变长部分的起点，所以至少要有一个固定参数。" },
      { id: 'variadic-functions-e3', tier: 'expert', type: 'judge',
            stem: "va_arg 能自动判断下一个参数的实际类型。",
            answer: false,
            explanation: "va_arg 必须显式指定类型，它不会推断。类型取错（如把 int 当 double 取）是未定义行为，这是变长参数最大的风险。" }
    ],

    /* ---- recursion ---- */
    'recursion': [
      { id: 'recursion-b1', tier: 'basic', type: 'single',
            stem: "递归函数必须有：",
            options: ["循环","终止条件","全局变量","指针参数"],
            answer: 1,
            explanation: "没有终止条件就会无限递归，直到栈空间耗尽崩溃。" },
      { id: 'recursion-m2', tier: 'master', type: 'single',
            stem: "int f(int n) { return n <= 1 ? 1 : n * f(n - 1); } 调用 f(4) 得：",
            options: ["10","24","4","120"],
            answer: 1,
            explanation: "f(4) = 4×3×2×1 = 24。递归逐层展开，每层规模减 1。" },
      { id: 'recursion-e3', tier: 'expert', type: 'single',
            stem: "朴素递归求斐波那契 fib(n) = fib(n-1) + fib(n-2) 的时间复杂度约为：",
            options: ["O(n)","O(n log n)","O(2^n)","O(n^2)"],
            answer: 2,
            explanation: "每次调用展开两支，且有大量重叠子问题，规模随 n 指数增长。n=40 就要算十几亿次，需改记忆化或迭代。" }
    ],

    /* ---- static-function ---- */
    'static-function': [
      { id: 'static-function-b1', tier: 'basic', type: 'judge',
            stem: "给函数加 static，它就只能被本 .c 文件内的代码调用。",
            answer: true,
            explanation: "static 把函数的外部链接改为内部链接，其他翻译单元看不到它，也不会产生符号冲突。" },
      { id: 'static-function-m2', tier: 'master', type: 'single',
            stem: "两个不同的 .c 文件各写一个 static int helper(void)，结果是：",
            options: ["链接时重复定义错误","完全合法，互不干扰","只能有一个起作用","编译错误"],
            answer: 1,
            explanation: "两者都是内部链接，符号不导出，所以可以同名共存。这正是用 static 隐藏实现细节的价值。" },
      { id: 'static-function-e3', tier: 'expert', type: 'single',
            stem: "把库的内部辅助函数都声明为 static，主要好处是：",
            options: ["运行更快","避免与使用者的同名符号冲突，并缩小导出符号表","节省内存","允许递归"],
            answer: 1,
            explanation: "内部实现用 static 藏起来，使用者可以放心定义同名函数，同时减小链接后的符号表、避免 ABI 污染。" }
    ],

    /* ---- array-1d ---- */
    'array-1d': [
      { id: 'array-1d-b1', tier: 'basic', type: 'single',
            stem: "int a[5]; 的合法下标范围是：",
            options: ["1 到 5","0 到 5","0 到 4","1 到 4"],
            answer: 2,
            explanation: "C 数组下标从 0 开始，长度 5 的数组下标是 0~4。a[5] 已越界。" },
      { id: 'array-1d-m2', tier: 'master', type: 'single',
            stem: "int a[5] = {1, 2}; 之后 a[3] 的值是：",
            options: ["未定义","0","2","垃圾值"],
            answer: 1,
            explanation: "部分初始化时，未显式给出的元素会被初始化为 0。这与「未初始化的局部数组」不同，后者才是垃圾值。" },
      { id: 'array-1d-e3', tier: 'expert', type: 'single',
            stem: "求数组元素个数的惯用写法是：",
            options: ["sizeof(a)","sizeof(a) / sizeof(a[0])","strlen(a)","a.length"],
            answer: 1,
            explanation: "sizeof(a) 是整个数组字节数，除以单个元素字节数即元素个数。注意这只在数组「未退化为指针」时有效，函数参数里会失效。" }
    ],

    /* ---- multidim-array ---- */
    'multidim-array': [
      { id: 'multidim-array-b1', tier: 'basic', type: 'single',
            stem: "int a[2][3]; 中元素总数是：",
            options: ["5","6","2","3"],
            answer: 1,
            explanation: "2 行 × 3 列 = 6 个元素。内存里仍是连续的 6 个 int。" },
      { id: 'multidim-array-m2', tier: 'master', type: 'single',
            stem: "int a[][3] = {{1,4},{3,2},{4,5,6},{0}}; 则 a[2][1] 的值是：",
            options: ["5","0","6","2"],
            answer: 0,
            explanation: "每行不足 3 个补 0。第 2 行是 {4,5,6}，所以 a[2][1] = 5。第一维长度由初始化行数（4）自动推断。" },
      { id: 'multidim-array-e3', tier: 'expert', type: 'single',
            stem: "把二维数组传给函数，参数声明正确的是：",
            options: ["void f(int **a)","void f(int a[][3])","void f(int a[][])","void f(int *a)"],
            answer: 1,
            explanation: "必须指定除第一维外的所有维度，编译器才知道每行多长、如何计算偏移。int** 与二维数组不兼容。" }
    ],

    /* ---- string-functions ---- */
    'string-functions': [
      { id: 'string-functions-b1', tier: 'basic', type: 'single',
            stem: "strlen(\"abc\") 的返回值是：",
            options: ["3","4","2","不确定"],
            answer: 0,
            explanation: "strlen 统计到 \\0 之前的字符数，不含结尾的 \\0，所以是 3。而 sizeof(\"abc\") 是 4。" },
      { id: 'string-functions-m2', tier: 'master', type: 'single',
            stem: "比较两个字符串内容是否相等，应使用：",
            options: ["a == b","strcmp(a, b) == 0","a != b","strlen(a) == strlen(b)"],
            answer: 1,
            explanation: "数组名比较的是地址。比内容要用 strcmp，返回 0 表示完全相同。" },
      { id: 'string-functions-e3', tier: 'expert', type: 'single',
            stem: "strncpy(dst, src, n) 的一个常见陷阱是：",
            options: ["它不能复制","当 src 长度 ≥ n 时，dst 不会自动补 \\0","它会溢出","它只能复制数字"],
            answer: 1,
            explanation: "strncpy 在 src 长度不足 n 时补 \\0；若 src 长度 ≥ n，则不会补结尾 \\0，dst 可能不是合法字符串。通常需要手动置 dst[n-1] = 0。" }
    ],

    /* ---- string-common-ops ---- */
    'string-common-ops': [
      { id: 'string-common-ops-b1', tier: 'basic', type: 'single',
            stem: "strstr(hay, needle) 找不到子串时返回：",
            options: ["空字符串","NULL","0 地址","-1"],
            answer: 1,
            explanation: "返回 NULL，所以调用后必须判空再使用。" },
      { id: 'string-common-ops-m2', tier: 'master', type: 'single',
            stem: "strtok 的一个限制是：",
            options: ["不能分割字符串","会修改原字符串，且内部保存状态不可重入","只能分割一次","只能处理数字"],
            answer: 1,
            explanation: "strtok 把分隔符就地改成 \\0，破坏原串；且内部记录位置，不能嵌套或并发使用。需要时可改用 strtok_r。" },
      { id: 'string-common-ops-e3', tier: 'expert', type: 'single',
            stem: "strcat(dst, src) 最危险的隐患是：",
            options: ["速度慢","不检查 dst 剩余空间，容易缓冲区溢出","不能拼接中文","会修改 src"],
            answer: 1,
            explanation: "strcat 只管从 dst 的 \\0 往后写，不检查容量。空间不足就写到别的内存里，是经典安全漏洞。" }
    ],

    /* ---- array-parameter ---- */
    'array-parameter': [
      { id: 'array-parameter-b1', tier: 'basic', type: 'judge',
            stem: "函数 void f(int a[10]) 能检查调用者是否真的传了 10 个元素。",
            answer: false,
            explanation: "方括号里的数字会被忽略，a 实际是 int*，函数无法知道长度，必须额外传长度参数。" },
      { id: 'array-parameter-m2', tier: 'master', type: 'single',
            stem: "在 void f(int a[10]) 内部，sizeof(a) 得到的是：",
            options: ["40","10","指针大小","编译错误"],
            answer: 2,
            explanation: "数组作参数退化为指针，sizeof 得到的是指针大小（64 位平台通常 8）。" },
      { id: 'array-parameter-e3', tier: 'expert', type: 'single',
            stem: "想让函数真正接收到整个数组的副本，可行的办法是：",
            options: ["参数写成 int a[]","把数组包进结构体，按值传结构体","加 const","用 int *a"],
            answer: 1,
            explanation: "结构体赋值会整体复制成员，包括里面的数组。这也是 C 里「按值传数组」的标准技巧。" }
    ],

    /* ---- union-type ---- */
    'union-type': [
      { id: 'union-type-b1', tier: 'basic', type: 'single',
            stem: "union 的大小等于：",
            options: ["所有成员大小之和","最大成员的大小（考虑对齐）","最小成员的大小","固定 4 字节"],
            answer: 1,
            explanation: "联合体的成员共享同一块内存，总大小要能容纳最大的成员，并按最严格的对齐要求补齐。" },
      { id: 'union-type-m2', tier: 'master', type: 'judge',
            stem: "联合体中同一时刻可以同时有效保存所有成员的值。",
            answer: false,
            explanation: "成员共享内存，写入一个会覆盖另一个。同一时刻只有一个成员的值是有效的。" },
      { id: 'union-type-e3', tier: 'expert', type: 'single',
            stem: "用 union 判断机器字节序（大小端）的经典做法是：",
            options: ["union { int i; char c[4]; } u; u.i = 1; 看 u.c[0] 是 1 还是 0","用 sizeof","用 printf","用 malloc"],
            answer: 0,
            explanation: "写 i=1 后，若 c[0]==1 则是小端（低位字节在前），若 c[3]==1 则是大端。利用联合体成员共享内存的特性。" }
    ],

    /* ---- bit-field ---- */
    'bit-field': [
      { id: 'bit-field-b1', tier: 'basic', type: 'single',
            stem: "struct { unsigned a : 3; } 中 a 最多能表示：",
            options: ["3","7","8","15"],
            answer: 1,
            explanation: "3 位无符号位域能表示 0~7，共 8 个值（2^3）。" },
      { id: 'bit-field-m2', tier: 'master', type: 'judge',
            stem: "位域的具体内存布局（从高位还是低位开始）由实现定义。",
            answer: true,
            explanation: "标准没有规定位域在字节内的排列顺序，不同编译器/平台可能不同，所以不适合跨平台的二进制格式。" },
      { id: 'bit-field-e3', tier: 'expert', type: 'single',
            stem: "位域最不适合用于：",
            options: ["节省内存的标志位","硬件寄存器映射","跨平台网络协议的数据结构","内部状态压缩"],
            answer: 2,
            explanation: "位域布局由实现定义，跨平台不可移植。网络协议必须手工按字节位操作来保证一致。" }
    ],

    /* ---- flexible-array-member ---- */
    'flexible-array-member': [
      { id: 'flexible-array-member-b1', tier: 'basic', type: 'single',
            stem: "柔性数组成员 struct S { int n; int data[]; }; 的特点是：",
            options: ["data 是固定长度数组","data 不占结构体大小，需 malloc 时额外申请空间","data 是空指针","不能使用"],
            answer: 1,
            explanation: "柔性数组成员必须是最后一个成员，sizeof(struct S) 不含 data。分配时按 sizeof(struct S) + n*sizeof(int) 申请。" },
      { id: 'flexible-array-member-m2', tier: 'master', type: 'single',
            stem: "为含柔性数组的结构体分配 10 个 int 的空间，正确写法是：",
            options: ["malloc(sizeof(struct S))","malloc(sizeof(struct S) + 10 * sizeof(int))","malloc(10 * sizeof(int))","malloc(sizeof(struct S) + 10)"],
            answer: 1,
            explanation: "结构体本身 + 数组元素总字节数。少算会越界，多算浪费。" },
      { id: 'flexible-array-member-e3', tier: 'expert', type: 'judge',
            stem: "含柔性数组成员的结构体可以作为另一个结构体的成员，或存入数组。",
            answer: false,
            explanation: "标准规定含柔性数组成员的结构体不能作为数组元素，也不能作为其他结构体的成员，因为它的大小不完整。" }
    ],

    /* ---- struct-array ---- */
    'struct-array': [
      { id: 'struct-array-b1', tier: 'basic', type: 'single',
            stem: "访问结构体数组第 i 个元素的成员 x，正确写法是：",
            options: ["arr.x[i]","arr[i].x","arr->x[i]","arr[i]->x"],
            answer: 1,
            explanation: "arr[i] 是结构体变量，用点访问成员。只有当 arr[i] 是结构体指针时才用 ->。" },
      { id: 'struct-array-m2', tier: 'master', type: 'single',
            stem: "Student *p = &list[0]; 则访问其 score 成员可用：",
            options: ["p.score 或 (*p).score","p->score 或 (*p).score","p->score 或 *p.score","p[0]->score"],
            answer: 1,
            explanation: "p 是指针，用 p->score；展开形式是 (*p).score。注意括号不能省，因为 . 优先级高于 *。" },
      { id: 'struct-array-e3', tier: 'expert', type: 'judge',
            stem: "结构体变量之间可以直接赋值（Student a = b;），会逐成员复制。",
            answer: true,
            explanation: "同类型的结构体可以直接赋值，会整体复制所有成员（包括数组成员）。但若成员里有指针，只复制指针值（浅拷贝）。" }
    ],

    /* ---- struct-padding ---- */
    'struct-padding': [
      { id: 'struct-padding-b1', tier: 'basic', type: 'judge',
            stem: "结构体的大小一定等于各成员大小之和。",
            answer: false,
            explanation: "为了满足对齐要求，编译器会在成员之间和末尾插入填充字节，所以结构体通常比成员之和大。" },
      { id: 'struct-padding-m2', tier: 'master', type: 'single',
            stem: "struct { char a; int b; char c; }; 在 int 需 4 字节对齐时，sizeof 通常是：",
            options: ["6","8","12","9"],
            answer: 2,
            explanation: "a 占 1 字节，后补 3 字节；b 占 4 字节；c 占 1 字节，末尾再补 3 字节使整体是 4 的倍数，共 12。" },
      { id: 'struct-padding-e3', tier: 'expert', type: 'single',
            stem: "把成员按大小从大到小排列，主要收益是：",
            options: ["运行更快","减少填充字节，缩小结构体体积","允许更多成员","避免对齐问题"],
            answer: 1,
            explanation: "大成员在前能减少对齐空隙。例如 int、char、char 只需 8 字节，而 char、int、char 需要 12 字节。" }
    ],

    /* ---- dangling-leak ---- */
    'dangling-leak': [
      { id: 'dangling-leak-b1', tier: 'basic', type: 'single',
            stem: "释放内存后继续通过原指针访问，这种指针叫：",
            options: ["空指针","野指针（悬垂指针）","函数指针","二级指针"],
            answer: 1,
            explanation: "free 之后指针仍保存原地址，但内存已不属于你，此时它就是悬垂指针，访问是未定义行为。" },
      { id: 'dangling-leak-m2', tier: 'master', type: 'single',
            stem: "free(p) 之后最应该立刻做的是：",
            options: ["继续使用 p","p = NULL","再次 free(p)","把 p 转成 int"],
            answer: 1,
            explanation: "置 NULL 后再误用会立刻崩溃（易发现），而不会静默破坏其他数据。且 free(NULL) 是安全的空操作。" },
      { id: 'dangling-leak-e3', tier: 'expert', type: 'single',
            stem: "函数返回局部数组的地址，为什么危险？",
            options: ["数组太大","函数返回后栈帧失效，那块内存随时会被覆盖","数组不能返回","会造成内存泄漏"],
            answer: 1,
            explanation: "局部数组在栈上，函数返回后栈帧被回收，指针指向无效区域。应改用 malloc（调用者负责释放）或传入缓冲区。" }
    ],

    /* ---- calloc-realloc ---- */
    'calloc-realloc': [
      { id: 'calloc-realloc-b1', tier: 'basic', type: 'single',
            stem: "calloc(n, size) 与 malloc(n * size) 的主要区别是：",
            options: ["calloc 更快","calloc 会把内存清零","calloc 不需要释放","没有区别"],
            answer: 1,
            explanation: "calloc 分配后全部置 0，malloc 不清零（内容是垃圾值）。" },
      { id: 'calloc-realloc-m2', tier: 'master', type: 'single',
            stem: "使用 realloc 的正确方式是：",
            options: ["p = realloc(p, n);","int *q = realloc(p, n); if (!q) { /* 处理失败，p 仍有效 */ } else p = q;","realloc(p, n) 后 p 一定有效","realloc 不需要检查返回值"],
            answer: 1,
            explanation: "realloc 失败返回 NULL 且原内存不变。若直接写 p = realloc(p, n)，失败时 p 被置 NULL，原内存就泄漏了。" },
      { id: 'calloc-realloc-e3', tier: 'expert', type: 'judge',
            stem: "realloc 成功后，原指针 p 就失效了，不能再使用或释放。",
            answer: true,
            explanation: "realloc 可能搬移内存，原块已被释放。之后必须使用返回的新指针，对旧指针 free 是重复释放。" }
    ],

    /* ---- memcpy-memmove ---- */
    'memcpy-memmove': [
      { id: 'memcpy-memmove-b1', tier: 'basic', type: 'single',
            stem: "memcpy 与 memmove 的关键区别是：",
            options: ["memcpy 更快但要求源和目标不重叠","memmove 不能复制结构体","memcpy 只能复制字符串","没有区别"],
            answer: 0,
            explanation: "memcpy 假定不重叠，实现更快；memmove 处理重叠（内部判断方向），更安全。" },
      { id: 'memcpy-memmove-m2', tier: 'master', type: 'single',
            stem: "把 a[0..3] 移到 a[1..4]（重叠），应使用：",
            options: ["memcpy(a+1, a, 4*sizeof(int))","memmove(a+1, a, 4*sizeof(int))","strcpy","两者都可以"],
            answer: 1,
            explanation: "源和目标重叠，必须用 memmove。用 memcpy 是未定义行为，可能得到被覆盖的错误数据。" },
      { id: 'memcpy-memmove-e3', tier: 'expert', type: 'single',
            stem: "memcpy 的第三个参数是：",
            options: ["元素个数","字节数","最大长度","源指针"],
            answer: 1,
            explanation: "memcpy 按字节复制，第三个参数是字节数。复制 n 个 int 要写 n * sizeof(int)，写 n 只复制了一部分。" }
    ],

    /* ---- memory-layout ---- */
    'memory-layout': [
      { id: 'memory-layout-b1', tier: 'basic', type: 'single',
            stem: "函数内的局部变量通常分配在：",
            options: ["栈","堆","数据段","代码段"],
            answer: 0,
            explanation: "局部变量在栈上，随函数调用自动分配、返回时自动回收。" },
      { id: 'memory-layout-m2', tier: 'master', type: 'single',
            stem: "未初始化的全局变量会被放在哪个段，初值是多少？",
            options: ["数据段，随机值","BSS 段，0","栈，0","堆，随机值"],
            answer: 1,
            explanation: "未初始化的全局/静态变量放在 BSS 段，程序启动时统一清零。而局部变量的初值不确定。" },
      { id: 'memory-layout-e3', tier: 'expert', type: 'single',
            stem: "在栈上定义 int buf[1000000]; 的主要风险是：",
            options: ["内存泄漏","栈空间不足导致栈溢出","编译错误","速度太慢"],
            answer: 1,
            explanation: "栈通常只有 1MB 左右，100 万个 int 是 4MB，会直接爆栈崩溃。大数组应改用 malloc 放堆上。" }
    ],

    /* ---- memory-leak-patterns ---- */
    'memory-leak-patterns': [
      { id: 'memory-leak-patterns-b1', tier: 'basic', type: 'single',
            stem: "下面哪种是内存泄漏？",
            options: ["malloc 后忘记 free","free 两次","访问已释放内存","数组越界"],
            answer: 0,
            explanation: "泄漏指申请了内存却永远不再释放，进程占用持续增长。重复释放和释放后使用是另一类错误。" },
      { id: 'memory-leak-patterns-m2', tier: 'master', type: 'single',
            stem: "用 gcc 调试内存错误，最直接的编译选项是：",
            options: ["-O2","-fsanitize=address","-Wall","-g"],
            answer: 1,
            explanation: "-fsanitize=address 启用 AddressSanitizer，能在运行时抓到越界、释放后使用、重复释放等问题。" },
      { id: 'memory-leak-patterns-e3', tier: 'expert', type: 'single',
            stem: "在循环里反复 malloc 却从不 free，后果是：",
            options: ["立即崩溃","内存持续增长，最终耗尽","编译失败","自动回收"],
            answer: 1,
            explanation: "C 没有垃圾回收，泄漏的内存在进程结束前一直占用。长时间运行的服务会逐渐耗尽内存。" }
    ],

    /* ---- fprintf-fscanf ---- */
    'fprintf-fscanf': [
      { id: 'fprintf-fscanf-b1', tier: 'basic', type: 'single',
            stem: "fprintf(fp, \"%d\", x) 与 printf(\"%d\", x) 的区别是：",
            options: ["没有区别","fprintf 写到文件 fp，printf 写到标准输出","fprintf 更慢","fprintf 不能格式化"],
            answer: 1,
            explanation: "两者格式化规则完全相同，只是输出目标不同。printf 等价于 fprintf(stdout, ...)。" },
      { id: 'fprintf-fscanf-m2', tier: 'master', type: 'single',
            stem: "用 fscanf 读入 double 变量，格式符应为：",
            options: ["%f","%lf","%d","%Lf"],
            answer: 1,
            explanation: "fscanf/scanf 必须区分 float(%f) 与 double(%lf)。用错是未定义行为。" },
      { id: 'fprintf-fscanf-e3', tier: 'expert', type: 'single',
            stem: "fscanf 返回值的含义是：",
            options: ["读到的字节数","成功赋值的项数，遇到 EOF 或错误时返回 EOF","总是 0","文件大小"],
            answer: 1,
            explanation: "返回成功匹配并赋值的项数。若在读到任何数据前就遇到文件结尾，返回 EOF(-1)。必须检查它才能发现读失败。" }
    ],

    /* ---- fread-fwrite ---- */
    'fread-fwrite': [
      { id: 'fread-fwrite-b1', tier: 'basic', type: 'single',
            stem: "fread(ptr, size, nmemb, fp) 的返回值是：",
            options: ["读到的字节数","成功读到的元素个数","0 或 1","文件大小"],
            answer: 1,
            explanation: "返回成功读到的「元素个数」（不是字节数）。若小于 nmemb，说明读到结尾或出错。" },
      { id: 'fread-fwrite-m2', tier: 'master', type: 'single',
            stem: "用 fwrite 写结构体到文件的隐患是：",
            options: ["fwrite 不能写结构体","结构体含填充字节，且跨平台布局/字节序可能不同，读出可能错乱","必须用文本模式","会泄漏内存"],
            answer: 1,
            explanation: "填充字节内容是未指定的，不同平台的成员布局、对齐、字节序也可能不同。跨平台存储应手动序列化各字段。" },
      { id: 'fread-fwrite-e3', tier: 'expert', type: 'judge',
            stem: "用 fread 读完整个文件后，应该检查 ferror(fp) 来区分「正常读完」和「读出错」。",
            answer: true,
            explanation: "feof 表示到达结尾，ferror 表示发生错误。两者含义不同，要分开判断才能给出正确提示。" }
    ],

    /* ---- fseek-position ---- */
    'fseek-position': [
      { id: 'fseek-position-b1', tier: 'basic', type: 'single',
            stem: "把文件位置移到文件开头，应使用：",
            options: ["fseek(fp, 0, SEEK_SET)","fseek(fp, 0, SEEK_END)","fseek(fp, 0, SEEK_CUR)","rewind 只能读"],
            answer: 0,
            explanation: "SEEK_SET 以文件头为基准，偏移 0 即回到开头。rewind(fp) 效果相同并清除错误标志。" },
      { id: 'fseek-position-m2', tier: 'master', type: 'single',
            stem: "求文件大小最常用的做法是：",
            options: ["fseek(fp, 0, SEEK_END); long n = ftell(fp);","fseek(fp, 0, SEEK_SET); ftell(fp)","用 sizeof","用 strlen"],
            answer: 0,
            explanation: "定位到末尾后，ftell 返回的偏移量就是文件总字节数。注意超大文件在 32 位平台上可能溢出。" },
      { id: 'fseek-position-e3', tier: 'expert', type: 'judge',
            stem: "在 Windows 的文本模式下，ftell 的返回值可能不等于文件的实际字节数。",
            answer: true,
            explanation: "文本模式会把 \\r\\n 转换为 \\n，导致位置与真实字节数不一致。需要精确字节数时应以 \"rb\" 二进制模式打开。" }
    ],

    /* ---- file-error-handling ---- */
    'file-error-handling': [
      { id: 'file-error-handling-b1', tier: 'basic', type: 'single',
            stem: "fopen 失败时返回：",
            options: ["0 地址","NULL","-1","空文件指针"],
            answer: 1,
            explanation: "返回 NULL，同时设置 errno。所以每次都该检查，不能直接用。" },
      { id: 'file-error-handling-m2', tier: 'master', type: 'single',
            stem: "perror(\"fopen\") 的作用是：",
            options: ["打开文件","打印「fopen: 系统错误说明」到标准错误","关闭文件","清空 errno"],
            answer: 1,
            explanation: "perror 把传入的字符串与 errno 对应的系统说明拼起来输出，例如 fopen: No such file or directory。" },
      { id: 'file-error-handling-e3', tier: 'expert', type: 'single',
            stem: "用 while (!feof(fp)) { fgets(...); } 读文件的问题在于：",
            options: ["不能读文本","feof 只在读失败后才为真，循环会多执行一次并处理无效数据","fgets 与 feof 冲突","会导致泄漏"],
            answer: 1,
            explanation: "正确写法是直接用 fgets 的返回值作循环条件：while (fgets(buf, sizeof buf, fp)) {...}" }
    ],

    /* ---- macro-pitfall ---- */
    'macro-pitfall': [
      { id: 'macro-pitfall-b1', tier: 'basic', type: 'single',
            stem: "#define SQUARE(x) ((x)*(x)) 中两层括号的作用是：",
            options: ["美观","防止参数和整体表达式被外部运算符错误结合","加快编译","类型检查"],
            answer: 1,
            explanation: "参数括号防止 SQUARE(a+b) 展开成 a+b*a+b；整体括号防止 SQUARE(x)*2 变成 ((x)*(x))*2 之外的错误解析。" },
      { id: 'macro-pitfall-m2', tier: 'master', type: 'single',
            stem: "#define MAX(a,b) ((a)>(b)?(a):(b)) 用 MAX(i++, j++) 会：",
            options: ["正常工作","参数被多次求值，i 或 j 可能自增两次","编译错误","返回 0"],
            answer: 1,
            explanation: "宏是文本替换，(a) 出现两次就展开两次，带副作用的参数会被执行多次。需要单次求值时用内联函数。" },
      { id: 'macro-pitfall-e3', tier: 'expert', type: 'single',
            stem: "关于宏与内联函数的选择，正确的是：",
            options: ["宏总是更好","需要类型检查和单次求值时用 static inline 函数；需要泛型或字符串化时才用宏","内联函数不能带参数","宏能调试"],
            answer: 1,
            explanation: "宏没有类型检查、参数会重复求值、调试困难。C99 的 static inline 在保留性能的同时解决了这些问题。" }
    ],

    /* ---- conditional-compilation ---- */
    'conditional-compilation': [
      { id: 'conditional-compilation-b1', tier: 'basic', type: 'single',
            stem: "#ifdef DEBUG 的含义是：",
            options: ["如果 DEBUG 已定义，编译下面的代码","定义 DEBUG","取消 DEBUG","总是编译"],
            answer: 0,
            explanation: "#ifdef 判断宏是否已定义，用于按条件包含代码段，常见于调试开关。" },
      { id: 'conditional-compilation-m2', tier: 'master', type: 'single',
            stem: "头文件保护的标准写法是：",
            options: ["#pragma once 是标准 C","#ifndef X_H / #define X_H / ... / #endif","#if X_H","#define X_H 后不需要 endif"],
            answer: 1,
            explanation: "ifndef + define + endif 是标准做法，任何编译器都支持。pragma once 是广泛支持的扩展，但不是标准。" },
      { id: 'conditional-compilation-e3', tier: 'expert', type: 'single',
            stem: "#if defined(A) && !defined(B) 与 #ifdef A 相比，优势是：",
            options: ["更快","可以在一个条件里组合多个宏判断","不需要 endif","能定义宏"],
            answer: 1,
            explanation: "#if 配合 defined() 可以写任意复杂条件（与、或、非），比 #ifdef 只能判单个宏灵活得多。" }
    ],

    /* ---- stringify-tokenpaste ---- */
    'stringify-tokenpaste': [
      { id: 'stringify-tokenpaste-b1', tier: 'basic', type: 'single',
            stem: "宏里 #x 的作用是：",
            options: ["注释","把参数 x 转成字符串字面量","取地址","连接两个记号"],
            answer: 1,
            explanation: "# 是字符串化运算符，把宏参数原样变成字符串。例如 STR(abc) 展开为 \"abc\"。" },
      { id: 'stringify-tokenpaste-m2', tier: 'master', type: 'single',
            stem: "宏里 ## 的作用是：",
            options: ["注释","把前后两个记号拼接成一个","字符串化","条件编译"],
            answer: 1,
            explanation: "## 是记号粘贴运算符，例如 #define CAT(a,b) a##b 使 CAT(foo, bar) 变成 foobar。" },
      { id: 'stringify-tokenpaste-e3', tier: 'expert', type: 'single',
            stem: "#define STR(x) #x 与 #define XSTR(x) STR(x) 中，XSTR 的意义是：",
            options: ["没有意义","让参数先展开再字符串化（两段宏技巧）","更快的版本","错误写法"],
            answer: 1,
            explanation: "STR(VERSION) 会得到字面量 \"VERSION\"；XSTR(VERSION) 先展开 VERSION 的宏值，再字符串化，得到实际版本号字符串。这是经典的两段宏技巧。" }
    ],

    /* ---- predefined-macros ---- */
    'predefined-macros': [
      { id: 'predefined-macros-b1', tier: 'basic', type: 'single',
            stem: "__LINE__ 展开成：",
            options: ["当前函数名","当前源代码行号","当前文件名","编译日期"],
            answer: 1,
            explanation: "__LINE__ 是当前行号（整数），配合 __FILE__ 常用于日志定位。" },
      { id: 'predefined-macros-m2', tier: 'master', type: 'single',
            stem: "__DATE__ 和 __TIME__ 表示的是：",
            options: ["程序运行时的当前时间","编译那一刻的日期和时间","文件创建时间","系统启动时间"],
            answer: 1,
            explanation: "它们是编译期常量，展开成编译时的字符串。绝不能用来做运行期的时间判断。" },
      { id: 'predefined-macros-e3', tier: 'expert', type: 'single',
            stem: "__func__ 与 __LINE__ 的一个关键区别是：",
            options: ["没有区别","__func__ 是函数内的预定义标识符（不是宏），只在函数体内有效","__func__ 是宏","__LINE__ 只在函数内有效"],
            answer: 1,
            explanation: "__func__ 是标准规定的预定义标识符，类型为 static const char[]，只在函数体内可用；__LINE__ 是预处理器宏，任何位置都能用。" }
    ],

    /* ---- undef-and-pragma ---- */
    'undef-and-pragma': [
      { id: 'undef-and-pragma-b1', tier: 'basic', type: 'single',
            stem: "#undef MAX 的作用是：",
            options: ["定义 MAX","取消 MAX 的宏定义","重定义 MAX","判断 MAX 是否存在"],
            answer: 1,
            explanation: "#undef 取消宏定义，之后的代码里 MAX 不再被替换。常用于避免与系统头文件的宏冲突。" },
      { id: 'undef-and-pragma-m2', tier: 'master', type: 'single',
            stem: "#pragma once 与头文件保护宏相比：",
            options: ["完全等价且都是标准","更简洁，但属于编译器扩展，不是 C 标准","必须配合 endif","只能用于 C++"],
            answer: 1,
            explanation: "pragma once 被主流编译器支持，写起来简洁，但标准只要求编译器忽略不认识的 pragma，严格可移植性不如保护宏。" },
      { id: 'undef-and-pragma-e3', tier: 'expert', type: 'single',
            stem: "使用 #pragma pack(push, 1) 后必须做的是：",
            options: ["无需其他操作","在合适位置 #pragma pack(pop) 恢复原对齐","加 endif","重新 include"],
            answer: 1,
            explanation: "push/pop 成对使用，把对齐临时改为 1 字节后必须 pop 恢复，否则后面所有结构体都会被紧凑排列。" }
    ],
    /* ---- variable-scope ---- */
    'variable-scope': [
      { id: 'variable-scope-b1', tier: 'basic', type: 'single',
            stem: "在函数内部定义的局部变量，其作用域是：",
            options: ["整个程序","从定义处到所在块结束","从程序开始到结束","只在第一行有效"],
            answer: 1,
            explanation: "局部变量的作用域从定义点开始，到包含它的最内层 {} 结束。出了这个块，名字就不存在了。" },
      { id: 'variable-scope-m2', tier: 'master', type: 'single',
            stem: "下面代码输出什么？\nint main(void) {\n    int x = 1;\n    { int x = 2; printf(\"%d\", x); }\n    printf(\"%d\", x);\n}",
            options: ["21","22","11","12"],
            answer: 0,
            explanation: "内层块重新定义了 x，遮蔽外层的 x，所以第一个 printf 输出 2；出块后外层 x 仍是 1，输出 1。合起来是 21。" },
      { id: 'variable-scope-e3', tier: 'expert', type: 'single',
            stem: "全局变量与 static 局部变量在生命周期上的区别是：",
            options: ["全局变量更长","两者都在程序整个运行期存在，只是作用域不同","static 局部变量在函数返回后销毁","没有区别"],
            answer: 1,
            explanation: "两者都是静态存储期，程序启动时分配、结束时释放。区别只在可见范围：全局变量整个文件可见，static 局部变量仅函数内可见。" }
    ],

    /* ---- declare-define ---- */
    'declare-define': [
      { id: 'declare-define-b1', tier: 'basic', type: 'judge',
            stem: "int x; 既是声明也是定义。",
            answer: true,
            explanation: "在文件作用域写 int x; 是暂定义（tentative definition），既有声明作用也分配存储。而 extern int x; 只是声明。" },
      { id: 'declare-define-m2', tier: 'master', type: 'single',
            stem: "extern int g; 的作用是：",
            options: ["定义并初始化 g","声明 g 在别处定义，不分配空间","分配 4 字节","让 g 变成常量"],
            answer: 1,
            explanation: "extern 是纯声明，告诉编译器「有这么个变量，定义在别处」。它不分配存储，链接时才去找真正的定义。" },
      { id: 'declare-define-e3', tier: 'expert', type: 'single',
            stem: "同一个变量可以被定义几次？",
            options: ["任意多次","一次","两次","每个 .c 文件一次"],
            answer: 1,
            explanation: "单一定义规则：整个程序里每个变量只能定义一次，但可以声明多次。多个 .c 各写一份定义会导致链接时重复定义错误。" }
    ],

    /* ---- const-qualifier ---- */
    'const-qualifier': [
      { id: 'const-qualifier-b1', tier: 'basic', type: 'single',
            stem: "const int MAX = 100; 之后对 MAX 的操作，正确的是：",
            options: ["可以修改","不能修改，修改会编译报错","只能在循环里修改","运行时才能确定"],
            answer: 1,
            explanation: "const 表示只读，尝试赋值会编译报错。注意它仍是变量（有地址、有存储），不是编译期常量。" },
      { id: 'const-qualifier-m2', tier: 'master', type: 'single',
            stem: "const int *p 与 int * const p 的区别是：",
            options: ["没有区别","前者不能通过 p 改指向的值，后者 p 本身不能改指向","前者 p 不能改，后者值不能改","两者都完全只读"],
            answer: 1,
            explanation: "const 修饰它左边的东西（左边没有则修饰右边）。const int *p 中 const 修饰 int，值不可改；int * const p 中 const 修饰 p，指针不可改。" },
      { id: 'const-qualifier-e3', tier: 'expert', type: 'judge',
            stem: "在 C 中，const 变量可以用在 case 标签里作为常量表达式。",
            answer: false,
            explanation: "C 的 const 变量不是常量表达式（与 C++ 不同），不能用于 case 标签或数组长度（变长数组除外）。要编译期常量请用 #define 或 enum。" }
    ],

    /* ---- volatile-qualifier ---- */
    'volatile-qualifier': [
      { id: 'volatile-qualifier-b1', tier: 'basic', type: 'single',
            stem: "volatile 告诉编译器：",
            options: ["变量是常量","该变量可能被程序之外的因素改变，不要优化掉对它的读写","变量在线程间共享","变量存在寄存器里"],
            answer: 1,
            explanation: "volatile 阻止编译器把读写优化掉或缓存到寄存器，因为它可能在别处（硬件、中断、其他线程）被修改。" },
      { id: 'volatile-qualifier-m2', tier: 'master', type: 'single',
            stem: "下面哪种场景最需要 volatile？",
            options: ["普通循环计数器","映射到硬件寄存器的地址","函数参数","局部数组"],
            answer: 1,
            explanation: "硬件寄存器会被外设随时改变，编译器无法感知，必须用 volatile。典型写法：volatile uint32_t *REG = (volatile uint32_t *)0x40020000;" },
      { id: 'volatile-qualifier-e3', tier: 'expert', type: 'judge',
            stem: "volatile 能保证多线程之间的数据同步。",
            answer: false,
            explanation: "volatile 只保证不被优化，不提供原子性和内存屏障，不能替代互斥锁或原子操作。多线程同步要用 <stdatomic.h> 或锁。" }
    ],

    /* ---- restrict-qualifier ---- */
    'restrict-qualifier': [
      { id: 'restrict-qualifier-b1', tier: 'basic', type: 'single',
            stem: "restrict 是 C99 引入的限定符，它主要用来：",
            options: ["限制变量范围","向编译器承诺指针是访问该对象的唯一途径，便于优化","限制数组长度","禁止修改"],
            answer: 1,
            explanation: "restrict 是优化提示：承诺通过该指针访问的对象不会被其他指针访问，编译器因此可以大胆重排和向量化。" },
      { id: 'restrict-qualifier-m2', tier: 'master', type: 'judge',
            stem: "如果违反 restrict 的承诺（用另一个指针访问同一对象），行为是未定义的。",
            answer: true,
            explanation: "restrict 是程序员给出的承诺，违反它属于未定义行为，编译器可能生成错误结果。" },
      { id: 'restrict-qualifier-e3', tier: 'expert', type: 'single',
            stem: "标准库中 memcpy 的参数带 restrict 而 memmove 不带，原因是：",
            options: ["memmove 更慢","memcpy 假定源和目标不重叠，memmove 必须处理重叠","memcpy 是 C99 新增","没有特别原因"],
            answer: 1,
            explanation: "memcpy 声明 restrict 表示两段内存不重叠，可高效复制；memmove 允许重叠，内部要判断方向，稍慢但更安全。" }
    ],

    /* ---- break-continue ---- */
    'break-continue': [
      { id: 'break-continue-b1', tier: 'basic', type: 'single',
            stem: "break 在循环中的作用是：",
            options: ["跳过本次循环","立即终止整个循环","重新开始循环","什么也不做"],
            answer: 1,
            explanation: "break 立即跳出当前循环（或 switch），不再执行后续迭代。" },
      { id: 'break-continue-m2', tier: 'master', type: 'single',
            stem: "continue 在 for 循环中的作用是：",
            options: ["终止循环","跳过本次循环剩余部分，直接进入下一次迭代（执行 i++ 和条件判断）","退出程序","跳过条件判断"],
            answer: 1,
            explanation: "continue 结束本次迭代，for 会继续执行增量表达式再判断条件。注意在 while 循环里若忘记更新变量，continue 可能导致死循环。" },
      { id: 'break-continue-e3', tier: 'expert', type: 'judge',
            stem: "break 只能用于循环语句中，不能用于 switch。",
            answer: false,
            explanation: "break 既能跳出循环，也能跳出 switch 的 case 分支。这是 switch 里最常见的用法。" }
    ],

    /* ---- goto-label ---- */
    'goto-label': [
      { id: 'goto-label-b1', tier: 'basic', type: 'single',
            stem: "goto 语句的作用是：",
            options: ["无条件跳转到同一函数内的标号处","跳出程序","调用函数","声明变量"],
            answer: 0,
            explanation: "goto 无条件跳到同一函数内的某个标号。不能跨函数跳转。" },
      { id: 'goto-label-m2', tier: 'master', type: 'judge',
            stem: "goto 可以跳转到另一个函数中的标号。",
            answer: false,
            explanation: "标号只在所属函数内可见，goto 不能跨函数。跨函数要用函数调用或 longjmp（谨慎使用）。" },
      { id: 'goto-label-e3', tier: 'expert', type: 'single',
            stem: "goto 在什么场景下仍被认为是合理用法？",
            options: ["替代所有循环","从多层嵌套中统一跳到清理代码（错误处理）","实现递归","替代函数调用"],
            answer: 1,
            explanation: "在多层嵌套中出错时，用 goto 跳到统一的 cleanup 标签可以避免重复的释放代码，是内核等代码的常见模式。滥用它会破坏结构。" }
    ],

    /* ---- pointer-array ---- */
    'pointer-array': [
      { id: 'pointer-array-b1', tier: 'basic', type: 'single',
            stem: "int a[5]; int *p = a; 之后 p[2] 等价于：",
            options: ["a[3]","a[2]","*(a+3)","&a[2]"],
            answer: 1,
            explanation: "指针和数组都能用下标，p[2] 就是 *(p+2)，即 a[2]。" },
      { id: 'pointer-array-m2', tier: 'master', type: 'single',
            stem: "表达式 *(a + i) 与下面哪个完全等价？",
            options: ["a[i]","&a[i]","a + i","*a + i"],
            answer: 0,
            explanation: "C 标准定义 a[i] 就是 *(a + i)。两者完全等价，下标只是语法糖。" },
      { id: 'pointer-array-e3', tier: 'expert', type: 'single',
            stem: "int a[5]; 则 &a + 1 与 a + 1 的区别是：",
            options: ["完全相同","&a+1 跳过整个数组，a+1 跳过一个元素","&a+1 非法","a+1 跳过整个数组"],
            answer: 1,
            explanation: "&a 的类型是 int(*)[5]（指向整个数组），加 1 跳过 5*4=20 字节；a 退化为 int*，加 1 只跳过 4 字节。" }
    ],

    /* ---- pointer-to-pointer ---- */
    'pointer-to-pointer': [
      { id: 'pointer-to-pointer-b1', tier: 'basic', type: 'single',
            stem: "int **pp 表示：",
            options: ["指向 int 的指针","指向「指向 int 的指针」的指针","int 数组","int 的别名"],
            answer: 1,
            explanation: "二级指针存放的是「一级指针的地址」。常用于在函数内修改调用者的指针本身。" },
      { id: 'pointer-to-pointer-m2', tier: 'master', type: 'single',
            stem: "要让函数修改调用者的指针 p（而不只是 p 指向的内容），参数应声明为：",
            options: ["int *p","int **p","int p","int p[]"],
            answer: 1,
            explanation: "传 &p（类型 int**），函数内用 *pp = ... 改写调用者的指针。这也是很多 API 用 out 参数的写法。" },
      { id: 'pointer-to-pointer-e3', tier: 'expert', type: 'single',
            stem: "int a = 1, *p = &a, **q = &p; 执行 **q = 5; 后 a 的值是：",
            options: ["1","5","地址值","未定义"],
            answer: 1,
            explanation: "q 指向 p，*q 就是 p，**q 就是 a。给 **q 赋值等于给 a 赋值，所以 a 变成 5。" }
    ],

    /* ---- const-and-pointer ---- */
    'const-and-pointer': [
      { id: 'const-and-pointer-b1', tier: 'basic', type: 'single',
            stem: "const char *s 表示：",
            options: ["s 不能改，所指内容可以改","s 可以改指向，但通过 s 不能修改所指内容","s 和内容都不能改","s 是常量数组"],
            answer: 1,
            explanation: "const 修饰 char，表示不通过 s 修改字符。s 本身是指针变量，可以改指向别的字符串。" },
      { id: 'const-and-pointer-m2', tier: 'master', type: 'single',
            stem: "char * const s 表示：",
            options: ["s 不能改指向，但可以通过 s 修改内容","s 可以改指向","内容和指向都不能改","s 是字符串常量"],
            answer: 0,
            explanation: "const 修饰 s 本身（指针），所以 s 一旦初始化就不能改指向；但指向的内容仍可修改。" },
      { id: 'const-and-pointer-e3', tier: 'expert', type: 'single',
            stem: "const char * const s 表示：",
            options: ["s 可改，内容可改","s 不可改，内容不可改","s 可改，内容不可改","s 不可改，内容可改"],
            answer: 1,
            explanation: "两个 const：左边修饰 char（内容只读），右边修饰 s（指针只读）。通常用于指向字符串字面量的指针。" }
    ],

    /* ---- void-pointer ---- */
    'void-pointer': [
      { id: 'void-pointer-b1', tier: 'basic', type: 'judge',
            stem: "可以对 void* 指针直接做加法运算 p + 1。",
            answer: false,
            explanation: "void 没有大小，编译器无法确定一步跨多少字节，标准禁止对 void* 做算术。要先转成 char* 或具体类型指针。" },
      { id: 'void-pointer-m2', tier: 'master', type: 'single',
            stem: "从 void* 转回具体类型指针，正确做法是：",
            options: ["直接赋值即可，无需转换","必须显式强制转换","不能用 void*","只能用 memcpy"],
            answer: 1,
            explanation: "任意对象指针可以隐式转成 void*，但反向必须显式写转换，因为编译器已丢失类型信息。" },
      { id: 'void-pointer-e3', tier: 'expert', type: 'single',
            stem: "qsort 的比较函数签名为 int cmp(const void *a, const void *b)，函数内部首先要：",
            options: ["直接解引用 a 和 b","把 a、b 转成具体类型指针再解引用","返回 0","释放 a 和 b"],
            answer: 1,
            explanation: "void* 不能直接解引用，必须先转成实际元素类型，例如 const int *pa = (const int *)a; 再比较 *pa。" }
    ],

    /* ---- arithmetic-assignment ---- */
    'arithmetic-assignment': [
      { id: 'arithmetic-assignment-b1', tier: 'basic', type: 'single',
            stem: "表达式 7 / 2 在 C 中的值是：",
            options: ["3.5","3","4","3.0"],
            answer: 1,
            explanation: "两个 int 相除做整数除法，向零截断，得 3。要得 3.5 需写成 7.0/2。" },
      { id: 'arithmetic-assignment-m2', tier: 'master', type: 'single',
            stem: "表达式 7 % 2 的值是：",
            options: ["1","3","3.5","0"],
            answer: 0,
            explanation: "% 是取余，7 除以 2 商 3 余 1。注意 % 两边必须是整数。" },
      { id: 'arithmetic-assignment-e3', tier: 'expert', type: 'single',
            stem: "表达式 -7 / 2 与 -7 % 2 在 C99 中的结果分别是：",
            options: ["-3 和 -1","-4 和 1","-3 和 1","-4 和 -1"],
            answer: 0,
            explanation: "C99 规定整数除法向零截断，-7/2 = -3；余数满足 a = (a/b)*b + a%b，所以 -7%2 = -1。这与 Python 的向下取整不同。" }
    ],

    /* ---- bitwise-operators ---- */
    'bitwise-operators': [
      { id: 'bitwise-operators-b1', tier: 'basic', type: 'single',
            stem: "5 & 3 的值是：",
            options: ["1","7","2","8"],
            answer: 0,
            explanation: "5=101、3=011，按位与得 001，即 1。" },
      { id: 'bitwise-operators-m2', tier: 'master', type: 'single',
            stem: "5 | 3 的值是：",
            options: ["1","7","2","0"],
            answer: 1,
            explanation: "101 | 011 = 111 = 7。按位或有 1 则 1。" },
      { id: 'bitwise-operators-e3', tier: 'expert', type: 'single',
            stem: "要把整数 x 的第 3 位（从 0 开始计数）置 1，应使用：",
            options: ["x |= (1 << 3)","x &= (1 << 3)","x ^= (1 << 3)","x = (1 << 3)"],
            answer: 0,
            explanation: "|= 与掩码 (1<<3) 做或运算，只把第 3 位置 1，其他位不变。&= 会清掉其他位，^= 是取反该位。" }
    ],

    /* ---- logical-short-circuit ---- */
    'logical-short-circuit': [
      { id: 'logical-short-circuit-b1', tier: 'basic', type: 'single',
            stem: "表达式 0 && (1/0) 会怎样求值？",
            options: ["崩溃","结果为 0，右边不求值","结果为 1","编译错误"],
            answer: 1,
            explanation: "&& 从左往右求值，左边为假就短路，右边完全不被求值，所以不会触发除零。" },
      { id: 'logical-short-circuit-m2', tier: 'master', type: 'single',
            stem: "若 p 是可能为 NULL 的指针，判断 p 非空且 *p==5，正确写法是：",
            options: ["*p == 5 && p != NULL","p != NULL && *p == 5","p == NULL || *p == 5","*p == 5 || p"],
            answer: 1,
            explanation: "必须先判 p 非空，利用 && 短路：p 为空时右边不解引用，避免崩溃。顺序写反会先解引用空指针。" },
      { id: 'logical-short-circuit-e3', tier: 'expert', type: 'single',
            stem: "1 || (i++) 执行后，i 的值：",
            options: ["加 1","不变","未定义","变成 1"],
            answer: 1,
            explanation: "|| 左侧为真即短路，右侧 i++ 不执行，所以 i 不变。副作用被短路掉是常见陷阱。" }
    ],

    /* ---- shift-operators ---- */
    'shift-operators': [
      { id: 'shift-operators-b1', tier: 'basic', type: 'single',
            stem: "1 << 3 的值是：",
            options: ["3","6","8","9"],
            answer: 2,
            explanation: "左移 3 位相当于乘 2^3 = 8。" },
      { id: 'shift-operators-m2', tier: 'master', type: 'single',
            stem: "对负数进行右移 >>，行为是：",
            options: ["一定是逻辑右移","一定是算术右移","由实现定义（多数为算术右移，补符号位）","编译错误"],
            answer: 2,
            explanation: "标准对负值右移的结果由实现定义。多数平台做算术右移（左边补 1）。移植代码里避免对负数右移。" },
      { id: 'shift-operators-e3', tier: 'expert', type: 'single',
            stem: "左移的位数等于或超过类型宽度（如 int 左移 32 位），行为是：",
            options: ["结果为 0","未定义行为","结果为原值","编译错误"],
            answer: 1,
            explanation: "标准规定移位位数必须小于类型宽度，否则是未定义行为。写 x << 32 在 32 位 int 上不可移植。" }
    ],

    /* ---- increment-decrement ---- */
    'increment-decrement': [
      { id: 'increment-decrement-b1', tier: 'basic', type: 'single',
            stem: "int i = 5; int a = i++; 之后 a 和 i 分别是：",
            options: ["5 和 6","6 和 6","5 和 5","6 和 5"],
            answer: 0,
            explanation: "后置 ++ 先取值再自增：a 得到 5，i 变成 6。" },
      { id: 'increment-decrement-m2', tier: 'master', type: 'single',
            stem: "int i = 5; int a = ++i; 之后 a 和 i 分别是：",
            options: ["5 和 6","6 和 6","6 和 5","5 和 5"],
            answer: 1,
            explanation: "前置 ++ 先自增再取值：i 变成 6，a 拿到 6。" },
      { id: 'increment-decrement-e3', tier: 'expert', type: 'single',
            stem: "int i = 1; i = i++ + 1; 的行为是：",
            options: ["i 变成 2","i 变成 3","未定义行为","编译错误"],
            answer: 2,
            explanation: "同一个表达式中对 i 既读又写且无序列点，是未定义行为。不同编译器结果可能不同，必须避免。" }
    ],

    /* ---- conditional-operator ---- */
    'conditional-operator': [
      { id: 'conditional-operator-b1', tier: 'basic', type: 'single',
            stem: "int a = 5, b = 3; int m = a > b ? a : b; 中 m 的值是：",
            options: ["5","3","1","8"],
            answer: 0,
            explanation: "条件 a>b 为真，取冒号前的 a，所以 m = 5。" },
      { id: 'conditional-operator-m2', tier: 'master', type: 'single',
            stem: "关于 ?: 运算符，正确的是：",
            options: ["只有真分支会被求值，假分支不执行","两个分支都会求值","它等价于 if-else 语句","它不能嵌套"],
            answer: 0,
            explanation: "?: 只对选中的那个分支求值，另一个分支不求值——这正是它能避免副作用的原因。" },
      { id: 'conditional-operator-e3', tier: 'expert', type: 'single',
            stem: "表达式 x > 0 ? 1 : x < 0 ? -1 : 0 的含义是：",
            options: ["绝对值","符号函数（正数 1、负数 -1、零 0）","最大值","总是 0"],
            answer: 1,
            explanation: "?: 右结合，等价于 x>0 ? 1 : (x<0 ? -1 : 0)，即符号函数。嵌套时可读性差，建议加括号。" }
    ],

    /* ---- comma-operator ---- */
    'comma-operator': [
      { id: 'comma-operator-b1', tier: 'basic', type: 'single',
            stem: "int x = (1, 2, 3); 之后 x 的值是：",
            options: ["1","2","3","编译错误"],
            answer: 2,
            explanation: "逗号表达式从左到右求值，整体值是最后一个，即 3。" },
      { id: 'comma-operator-m2', tier: 'master', type: 'single',
            stem: "int a, b; for (a = 0, b = 10; a < b; a++, b--) 中两个逗号的用法是：",
            options: ["都是参数分隔","都是逗号运算符，用于在一个表达式位置放多个操作","第一个是运算符，第二个不是","语法错误"],
            answer: 1,
            explanation: "for 的初始化部分和增量部分各只能放一个表达式，用逗号运算符就能同时操作两个变量。" },
      { id: 'comma-operator-e3', tier: 'expert', type: 'single',
            stem: "int a = 1; int x = a + 1, a + 2; 这样的写法：",
            options: ["x 得 4","x 得 2","语法错误：声明里的逗号是分隔符，不能这样用","x 得 3"],
            answer: 2,
            explanation: "声明语句中的逗号是「声明符分隔符」，不能当逗号运算符用。要写得加括号：int x = (a + 1, a + 2);" }
    ],
  };

  global.C_EXERCISES = {
    version: '1.0.0-full',
    tiers: tiers,
    byEntry: byEntry
  };
})(window);
