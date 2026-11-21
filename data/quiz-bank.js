/* =========================================================================
 * 试题库 · 成都大学计算机学院「转专业 → 计算机科学与技术」笔试方向
 * -------------------------------------------------------------------------
 * 来源说明（务必如实保留）：
 *   主体题目来自【用户提供的试卷截图】，由本机离线 OCR（RapidOCR）提取后，
 *   按「核心考点一致」原则改写题干 / 数值 / 选项，并用 gcc 实编核验答案。
 *   每题的 sourceNo 对应原卷题号；adapted 说明改了什么。
 *
 *   原卷：Pintia「2026.03.31：转专业《C语言程序设计》考试」，状态「已结束」。
 *   截图共 5 张：判断题 1-1~1-10、单选 2-1~2-30、3-1~3-5、
 *   程序填空 4-1~4-10、编程题标题 7-1~7-6（仅标题，无题面）。
 *   注意：这是用户提供的考试截图，不是学校官网公开发布的真题；
 *   截图里的「评测结果」用于交叉核对答案，OCR 存在错字，代码题按 C 语义复原。
 *
 *   官方考核范围依据（已实际抓取正文，只用于说明考试方向，不是题目来源）：
 *     https://computer.cdu.edu.cn/info/1019/11981.htm
 *       「笔试：C语言程序设计（120分钟），考生应具备 C语言基础知识，
 *         控制结构，程序编程等相关知识。」
 *     https://computer.cdu.edu.cn/info/1061/11088.htm （机考 + 面试，考前 pintia 训练）
 *     https://computer.cdu.edu.cn/info/1061/9933.htm  （附件名「C语言程序设计-转专业机考」）
 *
 * 题型：single（单选）/ judge（判断）/ blank（填空，精确匹配）/ program（编程，仅展示不判分）
 * 字段：id / type / topic / sourceNo / origin / adapted / stem / code / options /
 *       answer / acceptable / explanation / related / difficulty
 *   related 里的 id 对应 data/structures.js 的知识点条目
 * ========================================================================= */
(function (global) {
  'use strict';

  var sources = [
    {
      id: 'user-exam', title: '用户提供的真试题截图（Pintia 转专业《C语言程序设计》考试）',
      url: '', verified: 'user-provided-image',
      note: '5 张 jpg，本机 RapidOCR 离线识别；不是官网公开发布，题目按核心考点改写'
    },
    {
      id: 'cdu-2025', title: '成都大学计算机学院 2025-2026 学年本科学生转专业工作实施细则',
      url: 'https://computer.cdu.edu.cn/info/1019/11981.htm', verified: 'fetched-200',
      note: '仅用于说明考核科目与范围，不是题目来源'
    },
    {
      id: 'cdu-2024-exam', title: '计算机学院 2024-2025 学年转专业考核安排',
      url: 'https://computer.cdu.edu.cn/info/1061/11088.htm', verified: 'fetched-200',
      note: '机考 + 面试，考前要求在 pintia.cn 绑定题目集训练'
    },
    {
      id: 'cdu-2024-arrange', title: '计算机学院 2024 级转专业考核安排',
      url: 'https://computer.cdu.edu.cn/info/1061/9933.htm', verified: 'fetched-200',
      note: '附件名含「C语言程序设计-转专业机考-正式考试」'
    }
  ];

  var questions = [

    /* ============ 一、判断题（原卷 1-1 ~ 1-10，每题 1 分）============ */
    { id: 't01', type: 'judge', topic: '控制结构', sourceNo: '1-1', origin: '真题改写',
      adapted: '题干表述改为更明确的「本次/整个循环」对比，考点不变',
      stem: 'continue 不是结束本次循环，而是终止整个循环的执行。',
      answer: false,
      explanation: '说反了：continue 只结束本次循环、跳到下一次条件判断；break 才终止整个循环。原卷此题判「错误」。',
      related: ['break-continue', 'for-loop'], difficulty: 1 },

    { id: 't02', type: 'judge', topic: 'C语言基础知识', sourceNo: '1-2', origin: '真题改写',
      adapted: '把「主函数」改称标准写法 main，考点不变',
      stem: 'C 语言程序中可以有多个函数，但只能有一个 main 函数。',
      answer: true,
      explanation: '一个程序可以有任意多个函数，但执行的入口 main 只能有一个。原卷此题判「正确」。',
      related: ['main-function', 'function-prototype'], difficulty: 1 },

    { id: 't03', type: 'judge', topic: 'C语言基础知识', sourceNo: '1-3', origin: '真题改写',
      adapted: '补上「也可以是结构体、指针等」的提示方向，考点不变',
      stem: '结构体成员的类型必须是基本数据类型。',
      answer: false,
      explanation: '结构体成员可以是任何完整类型：数组、指针、另一个结构体、联合体都可以，只是不能直接包含「自己」这个不完整类型（但可以包含指向自己的指针）。',
      related: ['struct-type', 'union-type', 'flexible-array-member'], difficulty: 2 },

    { id: 't04', type: 'judge', topic: 'C语言基础知识', sourceNo: '1-4', origin: '真题改写',
      adapted: '补上 static / 全局变量的对照说明，考点不变',
      stem: '局部变量如果没有指定初值，则其初值不确定。',
      answer: true,
      explanation: '自动存储期的局部变量未初始化时值是不确定的，读取它是未定义行为。static 局部变量和全局变量才会被隐式初始化为 0。原卷截图此题「答案错误」是作答者答错，标准结论应为「正确」。',
      related: ['variable-scope', 'static-local-global'], difficulty: 2 },

    { id: 't05', type: 'judge', topic: '指针', sourceNo: '1-5', origin: '真题改写',
      adapted: '把 p++ / a++ 的例子换成更完整的说明，考点不变',
      stem: '有指针变量 p 和数组 a，指针变量和数组都可以实现本身的值的改变，如 p++ 和 a++。',
      answer: false,
      explanation: 'p++ 合法，但数组名 a 是不可修改的左值，a++ 编译报错。数组名在表达式里通常退化为指向首元素的指针常量，不能赋值、不能自增。',
      related: ['array-vs-pointer', 'pointer-array', 'pointer-deref'], difficulty: 2 },

    { id: 't06', type: 'judge', topic: '程序编程', sourceNo: '1-6', origin: '真题改写',
      adapted: '保留 printf("%.2f", 1.0/3) 原型，考点不变',
      stem: '语句 printf("%.2f", 1.0 / 3); 输出为 0.33。',
      answer: true,
      explanation: '%.2f 保留两位小数并四舍五入，1.0/3 ≈ 0.3333…，输出 0.33。注意 1/3 是整数除法得 0，写成 1.0/3 才是浮点除法。',
      related: ['fprintf-fscanf', 'arithmetic-assignment', 'float-double'], difficulty: 1 },

    { id: 't07', type: 'judge', topic: '控制结构', sourceNo: '1-7', origin: '真题改写',
      adapted: '补充 switch 也能用 break，考点不变',
      stem: 'break 语句只能用于循环语句中。',
      answer: false,
      explanation: 'break 既能跳出 while/do-while/for，也能跳出 switch 的 case 分支。原卷此题判「错误」。',
      related: ['break-continue', 'switch-case'], difficulty: 1 },

    { id: 't08', type: 'judge', topic: 'C语言基础知识', sourceNo: '1-8', origin: '真题改写',
      adapted: '补上大小写敏感的例子，考点不变',
      stem: 'C 语言中的变量名不区分大小写。',
      answer: false,
      explanation: 'C 区分大小写：sum、Sum、SUM 是三个不同的标识符。原卷截图「答案正确」是作答者判「错误」后得分，标准结论是「不区分大小写」这句话为假。',
      related: ['declare-define', 'variable-scope'], difficulty: 1 },

    { id: 't09', type: 'judge', topic: '数组与字符串', sourceNo: '1-9', origin: '真题改写',
      adapted: '补上「下标 0 ~ n-1」的说明，考点不变',
      stem: 'C 语言的数组下标从 0 开始。',
      answer: true,
      explanation: 'int a[10] 的合法下标是 0~9，a[10] 已经越界。这也是 for (i = 0; i < n; i++) 成为标准写法的原因。',
      related: ['array-1d', 'multidim-array'], difficulty: 1 },

    { id: 't10', type: 'judge', topic: '数组与字符串', sourceNo: '1-10', origin: '真题改写',
      adapted: '把 a==b 换成更清晰的两个字符数组比较，考点不变',
      stem: '判断字符串 a 和 b 是否相等的表达式为 if (a == b)。',
      answer: false,
      explanation: '数组名退化为地址，a == b 比的是两个数组的首地址，几乎永远不等。比内容要用 strcmp(a, b) == 0。原卷截图「答案错误」是作答者答错，标准结论为「错误」。',
      related: ['string-functions', 'array-vs-pointer', 'string-null-terminator'], difficulty: 2 },

    /* ============ 二、单选题（原卷 2-1 ~ 2-30，每题 1 分）============ */
    { id: 's01', type: 'single', topic: '指针', sourceNo: '2-1', origin: '真题改写',
      adapted: '变量名与选项文字微调，保留 (*p)++ 与 p++ 的对比',
      stem: '若变量已正确定义且指针 p 已指向变量 x，则 (*p)++ 相当于：',
      options: ['p++', 'x++', '*(p++)', '&x++'], answer: 1,
      explanation: '(*p) 就是 x 本身，(*p)++ 等价于 x++（先取值再把 x 加 1）。*(p++) 是「先自增指针、再解引用新地址」，含义完全不同；&x++ 语法非法。',
      related: ['pointer-deref', 'increment-decrement'], difficulty: 2 },

    { id: 's02', type: 'single', topic: '运算符', sourceNo: '2-2', origin: '真题改写',
      adapted: '选项按标准符号写清（原 OCR 把 || 读成 1II）',
      stem: '下列运算符中优先级最低的是：',
      options: ['||', '>=', '!=', '~'], answer: 0,
      explanation: '优先级由高到低：~（单目）> >=（关系）> !=（相等）> ||（逻辑或）。写条件时拿不准就加括号。',
      related: ['operator-precedence', 'logical-short-circuit'], difficulty: 2 },

    { id: 's03', type: 'single', topic: '运算符', sourceNo: '2-3', origin: '真题改写',
      adapted: '保留四个表达式结构，补上 A 选项（原 OCR 漏读）',
      stem: '若变量已正确定义并赋值，符合 C 语言语法的表达式是：',
      options: ['a + 2 = b', 'a = 3, 5', 'a = a + 1 = 3', '12.3 % 4'], answer: 1,
      explanation: 'a = 3, 5 是合法的逗号表达式。a+2=b、a=a+1=3 的左边都不是可修改左值；% 要求两边都是整数，12.3 % 4 编译报错。',
      related: ['arithmetic-assignment', 'operator-precedence'], difficulty: 2 },

    { id: 's04', type: 'single', topic: '运算符', sourceNo: '2-4', origin: '真题改写',
      adapted: '保留 5>3>1，补上「关系运算符左结合」的解析',
      stem: '表达式 5 > 3 > 1 的值是：',
      options: ['0', '1', '3', '表达式语法错误'], answer: 0,
      explanation: '语法合法但含义不是数学的「5>3 且 3>1」：关系运算符左结合，先算 5>3 得 1，再算 1>1 得 0。实编验证输出 0，gcc 还会给 -Wparentheses 警告。',
      related: ['operator-precedence', 'logical-short-circuit'], difficulty: 2 },

    { id: 's05', type: 'single', topic: '程序编程', sourceNo: '2-5', origin: '真题改写',
      adapted: '保留 scanf 四种写法，强调 & 取地址',
      stem: '若 a 是 int、c 是 float，则下列输入语句错误的是：',
      options: [
        'scanf("%d,%f", &a, &c);',
        'scanf("d=%d, c=%f", &a, &c);',
        'scanf("%d%f", &a, &c);',
        'scanf("%d%f", a, c);'
      ], answer: 3,
      explanation: 'scanf 必须拿到变量的地址，漏写 & 会把 a、c 的值当地址用，是未定义行为且通常直接崩溃。格式串里写普通字符（逗号、d= 等）是允许的，只是要求输入里也照着打。',
      related: ['fprintf-fscanf', 'pointer-deref'], difficulty: 2 },

    { id: 's06', type: 'single', topic: 'C语言基础知识', sourceNo: '2-6', origin: '真题改写',
      adapted: '保留四个整型常量选项',
      stem: '以下选项中不正确的整型常量是：',
      options: ['12L', '-10', '012', '2,900'], answer: 3,
      explanation: '12L 是 long 型常量，-10 是一元负号作用于 10，012 是八进制（=10）。C 的 numeric literal 里不能写千位逗号，2,900 不是单个常量。',
      related: ['literal-suffixes', 'integer-types-compared'], difficulty: 1 },

    { id: 's07', type: 'single', topic: '运算符', sourceNo: '2-7', origin: '真题改写',
      adapted: '补全 C、D 选项符号',
      stem: '在 C 语言中，要求运算数必须是整型的运算符是：',
      options: ['%', '/', '!', '~'], answer: 0,
      explanation: '%（取模）两边都必须是整数；/ 允许浮点；! 可用于标量；~ 也要求整型，但本题原卷标准答案是 %。实编验证 12.3 % 4 会编译报错。',
      related: ['arithmetic-assignment', 'bitwise-operators'], difficulty: 1 },

    { id: 's08', type: 'single', topic: 'C语言基础知识', sourceNo: '2-8', origin: '真题改写',
      adapted: '保留 029 这个经典陷阱',
      stem: '在 C 语言中，数字 029 是一个：',
      options: ['八进制数', '十进制数', '十六进制数', '非法数'], answer: 3,
      explanation: '以 0 开头是八进制，但八进制只许 0~7，出现 9 就是非法整型常量（编译报错）。这也是别用前导零写十进制数的原因。',
      related: ['literal-suffixes', 'integer-types-compared'], difficulty: 2 },

    { id: 's09', type: 'single', topic: '指针', sourceNo: '2-9', origin: '真题改写',
      adapted: '保留 int a[10], *p=a 的四个表达式',
      stem: '根据声明 int a[10], *p = a;，下列表达式错误的是：',
      options: ['a[9]', 'p[5]', 'a++', '*p++'], answer: 2,
      explanation: 'a 是数组名，属于不可修改左值，a++ 非法。p 是真正的指针变量，p[5]、*p++ 都合法（*p++ 等价于 *(p++)）。',
      related: ['array-vs-pointer', 'pointer-array', 'increment-decrement'], difficulty: 2 },

    { id: 's10', type: 'single', topic: '控制结构', sourceNo: '2-10', origin: '真题改写',
      adapted: '代码原样保留，答案用 gcc 实编核验',
      code: 'int i = 5, s = 0;\nwhile (i--) {\n    if (i % 2) continue;\n    else s += i;\n}',
      stem: '上面程序段执行后 s 的值为：',
      options: ['15', '10', '9', '6'], answer: 3,
      explanation: 'i-- 先取值再自减：进入循环体时 i 依次为 4,3,2,1,0；奇数被 continue 跳过，偶数累加 4+2+0=6。实编运行输出 s = 6。',
      related: ['while-do-while', 'break-continue', 'increment-decrement'], difficulty: 3 },

    { id: 's11', type: 'single', topic: 'C语言基础知识', sourceNo: '2-11', origin: '真题改写',
      adapted: '把「不能组成标识符」改成「不能作为首字符」，更贴近标准考点',
      stem: '按照标识符规则，下列哪一类字符不能出现在标识符的开头？',
      options: ['连接符 -', '下划线 _', '大小写字母', '数字字符'], answer: 3,
      explanation: '标识符可由字母、数字、下划线组成，但首字符不能是数字。- 本来就不允许出现在标识符里。原卷考点是「标识符组成规则」，这里统一到首字符限制上。',
      related: ['declare-define', 'variable-scope'], difficulty: 1 },

    { id: 's12', type: 'single', topic: '数组与字符串', sourceNo: '2-12', origin: '真题改写',
      adapted: '保留二维数组部分初始化，数值改为更好验算的一组',
      code: 'int a[][3] = { {1,4}, {3,2}, {4,5,6}, {0} };',
      stem: '上面定义中 a[2][1] 的值是：',
      options: ['5', '0', '6', '2'], answer: 0,
      explanation: '第二维是 3，每行不足的元素补 0：第 2 行是 {4,5,6}，所以 a[2][1] = 5。第一维长度由初始化列表行数（4）自动推断。',
      related: ['multidim-array', 'array-1d'], difficulty: 2 },

    { id: 's13', type: 'single', topic: '数组与字符串', sourceNo: '2-13', origin: '真题改写',
      adapted: '保留字符串字典序比较，选项换成更易判断的例子',
      stem: '下面关于字符串比较的描述，正确的是：',
      options: [
        '只有字符个数相同时才能比较两个字符串',
        '字符个数多的字符串一定更大',
        '按字典序逐字符比较，"STOP" 与 "STOP "（末尾多一个空格）相等',
        '"That" 小于 "The"'
      ], answer: 3,
      explanation: 'strcmp 按字典序逐字符比：前两个字符 "Th" 相同，第三个字符 \'a\'(97) < \'e\'(101)，所以 "That" < "The"。长度只在公共前缀相同后才起作用，且 "STOP" 与 "STOP " 不相等。',
      related: ['string-functions', 'string-null-terminator'], difficulty: 2 },

    { id: 's14', type: 'single', topic: '程序编程', sourceNo: '2-14', origin: '真题改写',
      adapted: '保留四个输入语句，补充 gets 已被移除的说明',
      stem: '有两个字符数组 a、b，则以下正确的输入语句是：',
      options: [
        'gets(a, b);',
        'scanf("%s%s", a, b);',
        'scanf("%s%s", &a, &b);',
        'gets("a"), gets("b");'
      ], answer: 1,
      explanation: '数组名本身已退化为 char*，直接传给 scanf 即可；&a 的类型是 char(*)[n]，类型不匹配。gets 只接受一个参数、且因无法限制长度已在 C11 被移除；字符串字面量更不能写入。生产代码建议 fgets。',
      related: ['fprintf-fscanf', 'fgets-line', 'array-vs-pointer'], difficulty: 2 },

    { id: 's15', type: 'single', topic: '运算符', sourceNo: '2-15', origin: '真题改写',
      adapted: '保留 x≥y≥z 的四种写法',
      stem: '为表示 x ≥ y ≥ z，须用的 C 语言表达式为：',
      options: ['(x>=y) && (y>=z)', '(x>=y) AND (y>=z)', 'x>=y>=z', '(x≥y) && (y≥z)'], answer: 0,
      explanation: 'C 没有数学里的连写比较，必须用 && 把两个关系表达式连起来。AND 和 ≥ 都不是 C 的运算符；x>=y>=z 会被左结合解析，含义错误。',
      related: ['logical-short-circuit', 'operator-precedence'], difficulty: 2 },

    { id: 's16', type: 'single', topic: '控制结构', sourceNo: '2-16', origin: '真题改写',
      adapted: '保留 for 循环四种描述',
      stem: '下面有关 for 循环的正确描述是：',
      options: [
        'for 循环只能用于循环次数确定的情况',
        'for 循环先执行循环体，再判断循环条件',
        'for 循环中不能用 break 跳出循环体',
        'for 循环的循环体可以包含多条语句，但多条语句必须构成复合语句'
      ], answer: 3,
      explanation: 'for 也常用于次数不确定的循环（条件可依赖运行时数据）；它先判断条件再执行；break 完全可用。循环体若要放多条语句，必须用 { } 组成复合语句，否则只有第一条属于循环体。',
      related: ['for-loop', 'break-continue', 'while-do-while'], difficulty: 2 },

    { id: 's17', type: 'single', topic: '程序编程', sourceNo: '2-17', origin: '真题改写',
      adapted: '保留 x = 10/4，答案实编核验',
      stem: '若 x 为 double 型，则执行 x = 10 / 4 后 x 的值是：',
      options: ['2.5', '2.0', '2（整数）', '3'], answer: 1,
      explanation: '10 和 4 都是 int，先做整数除法得 2，赋值给 double 后才变成 2.0。想得 2.5 必须写 10.0/4 或 (double)10/4。实编输出 2.000000。',
      related: ['implicit-conversion', 'arithmetic-assignment'], difficulty: 2 },

    { id: 's18', type: 'single', topic: '函数', sourceNo: '2-18', origin: '真题改写',
      adapted: '补全 D 选项（OCR 漏读），明确「定义时的返回类型」',
      stem: 'C 语言中函数返回值的类型是由什么决定的？',
      options: [
        'return 语句中表达式的类型',
        '调用该函数的主调函数的类型',
        '调用函数时临时决定',
        '函数定义时声明的返回类型'
      ], answer: 3,
      explanation: '返回类型在定义/声明时固定；return 后的表达式会被隐式转换成该类型。类型不符不会「临时决定」，而是发生转换甚至报警告。',
      related: ['function-prototype', 'implicit-conversion'], difficulty: 2 },

    { id: 's19', type: 'single', topic: '控制结构', sourceNo: '2-19', origin: '真题改写',
      adapted: '保留 i=j=10 作为条件的陷阱',
      code: 'for (int i = 0, j = 10; i = j = 10; i++, j--) { /* ... */ }',
      stem: '上面这个循环的循环次数是：',
      options: ['语法错误，不能执行', '无限次', '10 次', '1 次'], answer: 1,
      explanation: '条件是赋值 i = j = 10，表达式的值恒为 10（非 0 即真），与 i++、j-- 无关，循环永不结束。若写成 i == j 才是比较。',
      related: ['for-loop', 'arithmetic-assignment', 'if-else'], difficulty: 3 },

    { id: 's20', type: 'single', topic: '函数', sourceNo: '2-20', origin: '真题改写',
      adapted: '保留 return 四种描述',
      stem: '在一个被调用函数中，关于 return 语句的使用，描述错误的是：',
      options: [
        '被调用函数中可以不用 return 语句',
        '被调用函数中可以使用多个 return 语句',
        '函数若有返回值，就一定要有 return 语句把值带回去',
        '一个 return 语句可以返回多个值给调用函数'
      ], answer: 3,
      explanation: 'C 的 return 只能返回一个值。想返回多个值，要用指针/结构体参数或返回结构体。void 函数可以不写 return，也可以有多个 return 提前退出。',
      related: ['function-prototype', 'pass-by-value', 'struct-type'], difficulty: 2 },

    { id: 's21', type: 'single', topic: '控制结构', sourceNo: '2-21', origin: '真题改写',
      adapted: '保留 while 与 do-while 的对比',
      stem: 'C 语言中 while 与 do-while 循环的主要区别是：',
      options: [
        'do-while 的循环体至少无条件执行一次',
        'while 的循环控制条件比 do-while 严格',
        'do-while 允许从外部 goto 到循环体内',
        'do-while 的循环体不能是复合语句'
      ], answer: 0,
      explanation: 'while 先判断再执行，条件一开始为假就一次都不执行；do-while 先执行一次再判断，所以循环体至少执行一次。两者都能写复合语句和 break。',
      related: ['while-do-while', 'for-loop'], difficulty: 1 },

    { id: 's22', type: 'single', topic: '运算符', sourceNo: '2-22 / 2-24', origin: '真题改写',
      adapted: '原卷 2-22 与 2-24 考点重复（都是「表达式值为 0」），这里合并成一道',
      stem: '下列表达式的值为 0 的是：',
      options: ['3 % 5', '3 / 5.0', '3 / 5', '3 < 5'], answer: 2,
      explanation: '3/5 是整数除法得 0。3%5=3；3/5.0=0.6；3<5=1。实编验证：3/5=0、3/5.0=0.6、3%5=3。',
      related: ['arithmetic-assignment', 'implicit-conversion'], difficulty: 1 },

    { id: 's23', type: 'single', topic: 'C语言基础知识', sourceNo: '2-23', origin: '真题改写',
      adapted: '保留四个标识符选项，按单选标准答案取 4d',
      stem: '以下标识符中，不合法的是：',
      options: ['4d', '8_d', 'Int', 'key'], answer: 0,
      explanation: '首字符不能是数字，4d 和 8_d 都非法；若按原卷单选标准答案取 4d。Int 合法（不是关键字 int，C 区分大小写），key 合法。',
      related: ['declare-define', 'variable-scope'], difficulty: 2 },

    { id: 's24', type: 'single', topic: 'C语言基础知识', sourceNo: '2-25', origin: '真题改写',
      adapted: '保留 ASCII 运算，答案实编核验',
      stem: "已知 'A' 的 ASCII 码为 65，ch 为 char，执行 ch = 'A' + '6' - '3'; 后 ch 中的值是：",
      options: ["'D'（即 68）", '68 这个字符常量写法非法', "'C'（即 67）", '不确定'], answer: 0,
      explanation: "'6'-'3' = 3，65+3 = 68，即字符 'D'。实编输出 ch = 'D' (68)。注意 char 里存的是编码值 68，用 %c 打印才是字母 D。",
      related: ['char-variants', 'literal-suffixes'], difficulty: 2 },

    { id: 's25', type: 'single', topic: 'C语言基础知识', sourceNo: '2-26', origin: '真题改写',
      adapted: '保留四个 char 赋值，补全转义写法',
      stem: '定义 char a; 则以下赋值语句不恰当的是：',
      options: ['a = 65;', 'a = "A";', "a = '\\65';", "a = 6 + 'A';"], answer: 1,
      explanation: '"A" 是字符串字面量，类型是 char[2]（含 \\0），退化后是 char*，不能赋给 char。65、\'\\65\'（八进制转义 = \'A\'）、6+\'A\' 都是 int，赋给 char 会隐式转换，合法。',
      related: ['char-variants', 'string-null-terminator'], difficulty: 2 },

    { id: 's26', type: 'single', topic: '函数', sourceNo: '2-27', origin: '真题改写',
      adapted: '保留递归 f(n)=f(n-1)+n，答案实编核验',
      code: 'int f(int n) {\n    if (n) return f(n - 1) + n;\n    else return n;\n}',
      stem: '调用上面的 f(4)，其返回值为：',
      options: ['10', '4', '0', '以上均不是'], answer: 0,
      explanation: 'f(4)=f(3)+4=f(2)+3+4=f(1)+2+3+4=f(0)+1+2+3+4=10。实编运行输出 10。',
      related: ['function-prototype', 'if-else'], difficulty: 3 },

    { id: 's27', type: 'single', topic: 'C语言基础知识', sourceNo: '2-28', origin: '真题改写',
      adapted: '保留四种标点选项',
      stem: '通常，C 语句末尾以什么作为结束符？',
      options: ['逗号 ,', '句号 .', '分号 ;', '冒号 :'], answer: 2,
      explanation: '分号是语句结束符。注意复合语句 } 后不用分号，而 do-while 的 while(条件); 那个分号不能省。',
      related: ['main-function', 'while-do-while'], difficulty: 1 },

    { id: 's28', type: 'single', topic: '变量作用域', sourceNo: '2-29', origin: '真题改写',
      adapted: '保留全局变量 + 同名局部变量遮蔽，答案实编核验',
      code: 'int x = 5, y = 6;\nvoid incxy(void) { x++; y++; }\nint main(void) {\n    int x = 3;\n    incxy();\n    printf("%d, %d\\n", x, y);\n}',
      stem: '上面程序的运行结果是：',
      options: ['3, 6', '4, 7', '3, 7', '6, 7'], answer: 2,
      explanation: 'main 里的局部 x 遮蔽了全局 x，所以打印的 x 仍是 3；incxy 里改的是全局 x（变成 6）和全局 y（变成 7）。实编输出 3, 7。',
      related: ['variable-scope', 'static-local-global', 'pass-by-value'], difficulty: 3 },

    { id: 's29', type: 'single', topic: '指针', sourceNo: '2-30', origin: '真题改写',
      adapted: '保留指针解引用 + 加法的计算',
      code: 'int a = 10, b = 1;\nint *p = &a;\na = *p + b;',
      stem: '执行上面程序段后，变量 a 的值为：',
      options: ['12', '11', '10', '编译错误'], answer: 1,
      explanation: '*p 取到 a 的当前值 10，再加 b=1 得 11，赋回 a。p 指向 a 本身，但这里只是读取，没有改变指向。',
      related: ['pointer-deref', 'arithmetic-assignment'], difficulty: 2 },

    /* ============ 三、2 分单选题（原卷 3-1 ~ 3-5）============ */
    { id: 's30', type: 'single', topic: '控制结构', sourceNo: '3-1', origin: '真题改写',
      adapted: '把四个 switch 片段归纳成「合法 switch 的条件」，考点不变',
      stem: '设变量已正确定义，下列哪一项是合法的 switch 语句要求？',
      options: [
        'case 后面可以写任意表达式，包括变量',
        '同一个 switch 里允许出现两个相同的 case 常量',
        'switch(表达式) 的控制表达式必须是整型，case 标签必须是整型常量表达式',
        'default 必须写在所有 case 之前'
      ], answer: 2,
      explanation: '控制表达式与 case 标签都要是整型（含 char、枚举），case 标签必须是常量表达式且不能重复；case 2+2 这种常量表达式合法。default 可以放任意位置，通常放最后。',
      related: ['switch-case', 'break-continue'], difficulty: 2 },

    { id: 's31', type: 'single', topic: 'C语言基础知识', sourceNo: '3-2', origin: '真题改写',
      adapted: '保留判断数字字符的四种写法',
      stem: '判断 ch 是数字字符的 C 语言表达式是：',
      options: [
        "0 <= ch <= '9'",
        "ch >= '0' && ch <= '9'",
        "ch >= '1' && ch <= '10'",
        "只能调用库函数，不能自己写表达式"
      ], answer: 1,
      explanation: "C 不能连写比较，必须拆成两个关系表达式再用 && 连接。也可写 !(ch<'0' || ch>'9') 或直接用 isdigit((unsigned char)ch)。",
      related: ['logical-short-circuit', 'char-variants', 'operator-precedence'], difficulty: 2 },

    { id: 's32', type: 'single', topic: '运算符', sourceNo: '3-3', origin: '真题改写',
      adapted: '保留赋值语句四种写法',
      stem: 'C 语言里，下列选项正确的赋值语句是：',
      options: ['t += 1:', 'n1 = (n2 = (n3 = 0));', 'k = 1 = j;', 'a + 2 = b;'], answer: 1,
      explanation: '赋值表达式本身有值，可以嵌套连等；n1=(n2=(n3=0)) 合法。其余：冒号不是语句结尾、1 不是可修改左值、a+2 也不是左值。',
      related: ['arithmetic-assignment', 'operator-precedence'], difficulty: 2 },

    { id: 's33', type: 'single', topic: 'C语言基础知识', sourceNo: '3-4', origin: '真题改写',
      adapted: '保留注释四种说法',
      stem: '关于注释，下列说法中正确的是：',
      options: [
        '注释内容会保留在可执行程序里',
        'C 风格的 /* */ 块注释可以嵌套',
        '写注释的主要目的是提高程序的可读性',
        '注释写得越多，程序运行越慢'
      ], answer: 2,
      explanation: '注释在预处理阶段被替换成空白，不进可执行文件、不影响运行效率；/* */ 不能嵌套（第一个 */ 就结束了）。注释的唯一作用是给人看。',
      related: ['include-header', 'main-function'], difficulty: 1 },

    { id: 's34', type: 'single', topic: 'C语言基础知识', sourceNo: '3-5', origin: '真题改写',
      adapted: '原卷是多选题（部分正确得 1 分），这里改为单选，保留「合法标识符」考点',
      stem: '在 C 语言中，以下哪个是合法标识符？',
      options: ['Large&Tall', '4d', 'int', 'Counter1'], answer: 3,
      explanation: 'Counter1 由字母、数字组成且以字母开头，合法。Large&Tall 含非法字符 &；4d 以数字开头；int 是关键字，不能作标识符。',
      related: ['declare-define', 'variable-scope'], difficulty: 1 },

    /* ============ 四、程序填空 / 读程序写结果（原卷 4-1 ~ 4-10，每题 2 分）============ */
    { id: 'b01', type: 'blank', topic: '控制结构', sourceNo: '4-1', origin: '真题改写',
      adapted: '保留 for 步长循环次数，数值用 gcc 核验',
      code: 'int i;\nfor (i = 1; i < 10; i += 3) printf("*");',
      stem: '上面循环体将执行几次？（填数字）',
      answer: '3', acceptable: ['3', '３'],
      explanation: 'i 依次为 1、4、7，下一次 10 不满足 i<10，共 3 次。实编计数输出 3。',
      related: ['for-loop', 'increment-decrement'], difficulty: 2 },

    { id: 'b02', type: 'blank', topic: '控制结构', sourceNo: '4-2', origin: '真题改写',
      adapted: '原 OCR 把循环上界读错（截图答案 10 与代码不符），这里改用可验证的 1~10 累加，考点「读循环求和」不变',
      code: 'int i, sum = 0;\nfor (i = 1; i <= 10; i++) sum = sum + i;',
      stem: '执行上面程序段后 sum 的值是？（填数字）',
      answer: '55', acceptable: ['55', '５５'],
      explanation: '1+2+…+10 = 55，实编运行输出 55。这类题要看清循环上界与累加变量有没有初始化。',
      related: ['for-loop', 'arithmetic-assignment'], difficulty: 2 },

    { id: 'b03', type: 'blank', topic: 'C语言基础知识', sourceNo: '4-3 / 4-7', origin: '真题改写',
      adapted: '原卷分别考小写字母与数字字符的 ASCII，这里合并为「字符常量相减」考点',
      stem: "C 语言中 'z' - 'a' 的值是？（填数字）",
      answer: '25', acceptable: ['25', '２５'],
      explanation: '小写字母在 ASCII 里连续排列，\'z\'(122) - \'a\'(97) = 25。同理 \'9\'-\'0\' = 9。',
      related: ['char-variants', 'literal-suffixes'], difficulty: 2 },

    { id: 'b04', type: 'blank', topic: '控制结构', sourceNo: '4-4', origin: '真题改写',
      adapted: '保留 switch 无 break 贯穿，代码按 C 语义复原',
      code: "char c = 'a';\nint k = 4;\nswitch (c) {\n    case 's': k = k + 1; break;\n    case 'a': k = k + 2;\n    case 'c': k = k + 3;\n}\nprintf(\"%d\", k);",
      stem: '上面程序输出 k 的值是？（填数字）',
      answer: '9', acceptable: ['9', '９'],
      explanation: "命中 case 'a' 后先 k=6，因为没有 break 继续贯穿到 case 'c'，再 k=9。若 c='s' 则命中第一个 case 后立即 break，输出 5。这正是 switch fall-through 考点。",
      related: ['switch-case', 'break-continue'], difficulty: 3 },

    { id: 'b05', type: 'blank', topic: '指针', sourceNo: '4-5', origin: '真题改写',
      adapted: '原 OCR 代码残缺，改为等价的「二级指针 / 指针赋值」考点',
      code: 'int a = 1, *p = &a, **q = &p;\n**q = **q + 1;',
      stem: '执行上面程序段后 a 的值是？（填数字）',
      answer: '2', acceptable: ['2', '２'],
      explanation: 'q 指向 p，*q 就是 p，**q 就是 a。把 **q 加 1 等价于 a++，所以 a = 2。',
      related: ['pointer-to-pointer', 'pointer-deref'], difficulty: 3 },

    { id: 'b06', type: 'blank', topic: '运算符', sourceNo: '4-6', origin: '真题改写',
      adapted: '保留「用 / 和 % 拆出各位数字」考点，数值换成可验证的 987',
      code: 'int number = 987;\nprintf("%d-%d-%d", number % 16, number / 16 % 16, number / 16 / 16);',
      stem: '上面程序的输出是？（按 x-y-z 格式填，只填数字和连字符）',
      answer: '11-13-3', acceptable: ['11-13-3', '11－13－3'],
      explanation: '987 % 16 = 11；987/16 = 61，61 % 16 = 13；61/16 = 3。实编输出 11-13-3。这类题考查「整数除法取整 + 取模拆位」。',
      related: ['arithmetic-assignment', 'operator-precedence'], difficulty: 3 },

    { id: 'b07', type: 'blank', topic: '函数', sourceNo: '4-8', origin: '真题改写',
      adapted: '原卷是「输出 1~10 中满足 fun(n)==1 的数」，OCR 代码残缺；这里保留「自定义函数 + 循环筛选」考点，改成等价可验证的素数判断',
      code: 'int isPrime(int n) {\n    if (n < 2) return 0;\n    for (int i = 2; i * i <= n; i++)\n        if (n % i == 0) return 0;\n    return 1;\n}\n/* main 中：for (n = 2; n <= 10; n++) if (isPrime(n)) printf("%d", n); */',
      stem: '执行上面 main 中的循环，输出是？（只填数字，不要空格）',
      answer: '2357', acceptable: ['2357', '２３５７'],
      explanation: '2~10 里的素数是 2、3、5、7，连续打印得到 2357。考点是「函数返回值作为 if 条件 + 循环内逐个筛选」。',
      related: ['function-prototype', 'for-loop', 'if-else'], difficulty: 3 },

    { id: 'b08', type: 'blank', topic: '控制结构', sourceNo: '4-9', origin: '真题改写',
      adapted: '原截图答案 16/4 对应内外层都是 1~n；这里保留「嵌套循环次数」考点，代码明确写成两层 1~n，n=4',
      code: 'int n = 4, i, j;\nfor (i = 1; i <= n; i++) {\n    for (j = 1; j <= n; j++) printf("%d", i * j);  /* 语句① */\n    printf("\\n");                                  /* 语句② */\n}',
      stem: '语句①执行了多少次？（填数字）',
      answer: '16', acceptable: ['16', '１６'],
      explanation: '外层跑 4 次，每次内层跑 4 次，共 4×4 = 16 次；语句②（换行）只随外层执行 4 次。若内层是 j<=i，则变成 1+2+3+4 = 10 次。',
      related: ['for-loop', 'multidim-array'], difficulty: 3 },

    { id: 'b09', type: 'blank', topic: '数组与字符串', sourceNo: '4-10', origin: '真题改写',
      adapted: '保留「有序数组从后往前腾位置插入」考点，数值实编核验',
      code: 'double s[6] = {1, 3, 5, 7, 9};\ndouble x;\nint i;\nscanf("%lf", &x);\nfor (i = 4; i >= 0; i--) {\n    if (s[i] > x) s[i + 1] = s[i];\n    else break;\n}\ns[i + 1] = x;',
      stem: '若输入 4，插入后 x 被放在 s 的第几个位置（下标从 0 开始）？（填数字）',
      answer: '2', acceptable: ['2', '２'],
      explanation: '数组 1,3,5,7,9 升序。比 4 大的 5、7、9 依次后移，最后把 4 放到下标 2（得到 1,3,4,5,7,9）。输入 5 时放到下标 3，与截图给出的两组答案一致。',
      related: ['array-1d', 'for-loop', 'break-continue'], difficulty: 3 },

    /* ============ 七、编程题（原卷 7-1 ~ 7-6，截图只有标题，无题面）============ */
    { id: 'p01', type: 'program', topic: '程序编程', sourceNo: '7-1', origin: '真题标题',
      adapted: '截图只有标题「Hello World!」，没有输入输出要求，此处不编造题面，只记录考点',
      stem: 'Hello World!（原卷编程题，截图仅含标题）',
      explanation: '考查最基本的程序框架：#include <stdio.h>、int main(void)、printf 与 return 0。详见速查页「main 函数」「#include 头文件」。',
      related: ['main-function', 'include-header', 'fprintf-fscanf'], difficulty: 1 },

    { id: 'p02', type: 'program', topic: '程序编程', sourceNo: '7-2', origin: '真题标题',
      adapted: '截图只有标题「成绩是否及格」，未给分数线/输入格式，不编造',
      stem: '成绩是否及格（原卷编程题，截图仅含标题）',
      explanation: '考查 if / else 分支与关系运算符。典型写法是读入成绩，与及格线比较后输出结论；注意别把 = 写成 ==。',
      related: ['if-else', 'operator-precedence'], difficulty: 1 },

    { id: 'p03', type: 'program', topic: '程序编程', sourceNo: '7-3', origin: '真题标题',
      adapted: '截图只有标题「求奇数和」，未给数据范围，不编造',
      stem: '求奇数和（原卷编程题，截图仅含标题）',
      explanation: '考查 for 循环 + 取模判奇偶 + 累加。核心是 i % 2 != 0 与 sum 初始化为 0。',
      related: ['for-loop', 'arithmetic-assignment'], difficulty: 2 },

    { id: 'p04', type: 'program', topic: '程序编程', sourceNo: '7-4', origin: '真题标题',
      adapted: '截图只有标题「查找整数」，未给数组规模，不编造',
      stem: '查找整数（原卷编程题，截图仅含标题）',
      explanation: '考查一维数组遍历 + 顺序查找 + break 提前退出，以及「找到/没找到」的标志变量。',
      related: ['array-1d', 'for-loop', 'break-continue'], difficulty: 2 },

    { id: 'p05', type: 'program', topic: '程序编程', sourceNo: '7-5', origin: '真题标题',
      adapted: '截图只有标题「字符串逆序」，未给输入输出格式，不编造',
      stem: '字符串逆序（原卷编程题，截图仅含标题）',
      explanation: '考查字符数组、strlen 与双指针首尾交换；注意末尾 \'\\0\' 不参与交换，也不要用 gets。',
      related: ['string-functions', 'string-null-terminator', 'array-1d'], difficulty: 2 },

    { id: 'p06', type: 'program', topic: '程序编程', sourceNo: '7-6', origin: '真题标题',
      adapted: '截图只有标题「求矩阵各行元素之和」，未给矩阵规模，不编造',
      stem: '求矩阵各行元素之和（原卷编程题，截图仅含标题）',
      explanation: '考查二维数组 + 双重循环：外层枚举行、内层把该行各列累加，每行算完再输出结果。',
      related: ['multidim-array', 'for-loop', 'array-1d'], difficulty: 2 }
  ];

  global.C_QUIZ_BANK = {
    version: '0.2.0-from-exam',
    scope: '成都大学计算机学院 · 转专业（计算机科学与技术方向）笔试',
    warning: '主体题目按用户提供的真试题截图整理改写（核心考点一致）；非官方公开发布，OCR 文本经 gcc 实编核对；编程题仅保留标题。',
    official: {
      subject: 'C 语言程序设计',
      duration: '120 分钟',
      coverage: ['C语言基础知识', '控制结构', '程序编程'],
      weighting: '笔试 60% + 面试 40%，综合成绩原则上 ≥60',
      plan: '2025-2026 学年计算机科学与技术招 20 人，限理科生'
    },
    examStructure: [
      { section: '一', type: '判断题', no: '1-1 ~ 1-10', score: '1 分/题', note: '截图含评测结果' },
      { section: '二', type: '单选题', no: '2-1 ~ 2-30', score: '1 分/题', note: '最长的一段，p4 超长截图' },
      { section: '三', type: '单选/多选', no: '3-1 ~ 3-5', score: '2 分/题', note: '3-5 原为多选，部分正确得 1 分' },
      { section: '四', type: '程序填空 / 读程序写结果', no: '4-1 ~ 4-10', score: '2 分/题', note: '填数字，前后不加空格' },
      { section: '七', type: '编程题', no: '7-1 ~ 7-6', score: '—', note: '截图只有标题与通过率，无题面' }
    ],
    sources: sources,
    questions: questions
  };
})(window);
