import { FactorSuggestion, CaseData } from '../types';

export const ZODIAC_SIGNS = [
  '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
  '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'
];

export const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export const FACTOR_SUGGESTIONS: FactorSuggestion[] = [
  {
    keywords: ['工作', '跳槽', '职场', '上班', '公司', '职业'],
    factors: ['薪资待遇', '团队氛围', '发展空间', '通勤时间']
  },
  {
    keywords: ['感情', '恋爱', '结婚', '分手', '复合', '伴侣'],
    factors: ['三观契合', '经济基础', '家庭背景', '未来规划']
  },
  {
    keywords: ['学习', '考研', '留学', '专业', '学校', '教育'],
    factors: ['学术水平', '就业前景', '学费成本', '城市环境']
  },
  {
    keywords: ['买房', '租房', '搬家', '居住', '房子', '公寓'],
    factors: ['价格预算', '地理位置', '周边配套', '户型朝向']
  },
  {
    keywords: ['买车', '车型', '出行', '交通', '自驾'],
    factors: ['价格预算', '油耗性能', '品牌口碑', '维护成本']
  },
  {
    keywords: ['旅行', '旅游', '度假', '目的地', '行程'],
    factors: ['预算成本', '风景体验', '安全程度', '交通便利']
  }
];

export const MOCK_CASES: CaseData[] = [
  { id: '1', mbti: 'ISFP', zodiac: '巨蟹座', decision: '和前任复合但各过各的', description: '保持恋人关系但不住在一起，周末见面平时各忙各的', story: '和前任分手半年后又复合了，但约定好不住在一起，各自有各自的生活，只有周末才见面。朋友都说这是在浪费时间，但自己觉得这样的距离刚刚好。' },
  { id: '2', mbti: 'INTJ', zodiac: '摩羯座', decision: '裸辞创业做手工皮具', description: '放弃高薪工作，用全部积蓄开一家手工皮具工作室', story: '在大厂干了五年，突然觉得人生没意思，决定开一家手工皮具工作室。所有人都觉得他疯了，但他说这是第一次觉得自己活着。' },
  { id: '3', mbti: 'ENFP', zodiac: '射手座', decision: '用三个月环游世界', description: '辞去稳定工作，带着背包去南美、非洲流浪三个月', story: '工作三年存了十万块，突然辞职去环游世界。爸妈说她不务正业，她说有些事现在不做以后就没机会了。' },
  { id: '4', mbti: 'ISTJ', zodiac: '金牛座', decision: '每天早起两小时学英语', description: '坚持了半年，现在已经可以流利对话了', story: '为了跳槽去外企，每天五点起床学英语，坚持了整整一年。中间无数次想放弃，但还是咬牙挺过来了。' },
  { id: '5', mbti: 'ESFJ', zodiac: '双鱼座', decision: '收养三只流浪猫', description: '本来只想养一只，结果变成了猫奴', story: '下班路上捡到一只流浪猫，带回家后一发不可收拾，现在已经是三只猫的铲屎官了。房租一半都花在猫身上，但心甘情愿。' },
  { id: '6', mbti: 'INFJ', zodiac: '天蝎座', decision: '放弃保研去支教', description: '在偏远山区教了两年书，改变了很多孩子的命运', story: '拿到了保研通知书，却选择去山区支教两年。同学都说她傻，她说山里的孩子更需要她。' },
  { id: '7', mbti: 'ENTP', zodiac: '双子座', decision: '同时打三份工', description: '白天上班，晚上做自媒体，周末开网约车', story: '为了早点买房，同时打三份工，每天只睡五个小时。朋友都说他要钱不要命，但他说想要的东西只能自己挣。' },
  { id: '8', mbti: 'ISFJ', zodiac: '天秤座', decision: '辞掉高薪工作去开猫咖', description: '放弃了大厂的高薪工作，用积蓄开了一家猫咖啡馆', story: '在大厂干了五年，每天996，觉得人生不应该这样。辞职开了一家猫咖，虽然赚得少了，但每天都很开心。' },
  { id: '9', mbti: 'ESTP', zodiac: '白羊座', decision: '买了一辆二手跑车', description: '花光积蓄买了梦想中的跑车，虽然维修费用很高', story: '从小就喜欢跑车，工作五年终于攒够钱买了一辆二手的。朋友们都说不实用，但他说这是梦想，不能用实用来衡量。' },
  { id: '10', mbti: 'INFP', zodiac: '水瓶座', decision: '去寺庙住了一个月', description: '放下手机，体验了一段清净的修行生活', story: '工作压力太大，焦虑到失眠。索性请假去寺庙住了一个月，每天打坐念经，感觉整个人都被净化了。' },
  { id: '11', mbti: 'ENTJ', zodiac: '狮子座', decision: '拒绝了大厂offer', description: '选择了一家小公司当合伙人，虽然风险很大', story: '毕业拿到了大厂的offer，却选择加入一家只有十个人的创业公司当合伙人。所有人都觉得他疯了，他说要赌一把大的。' },
  { id: '12', mbti: 'ESFP', zodiac: '天秤座', decision: '报名参加选秀节目', description: '从来没学过唱歌跳舞，却勇敢地站上了舞台', story: '从小就有明星梦，但从来没敢说出来。二十五岁这年，终于鼓起勇气报名了选秀节目，虽然第一轮就被淘汰了，但不后悔。' },
];

export const PERSONALITY_TAGS = [
  {
    condition: (data: { economicWeight: number }) => data.economicWeight > 55,
    tag: '全自动利己精算师',
    description: '在金钱面前，你的纠结通常不超过3秒。你不是选择困难，你只是嫌赚得不够多。'
  },
  {
    condition: (data: { avgDriftRate: number }) => data.avgDriftRate > 25,
    tag: '戏剧性情绪风暴眼',
    description: '你的想法变快得连天气预报都追不上。周一想拯救世界，周五只想摆烂躺平。'
  },
  {
    condition: (data: { completedCount: number }) => data.completedCount >= 10,
    tag: '决策永动机',
    description: '你做决策的速度比外卖小哥还快。没有什么能阻挡你前进的脚步，除了下一个选择。'
  },
  {
    condition: (data: { longTermCount: number; completedCount: number }) => data.completedCount > 0 && data.longTermCount > data.completedCount * 0.5,
    tag: '深度纠结患者',
    description: '每个决定都要反复琢磨，你不是在做选择，你是在进行一场哲学思辨。'
  },
  {
    condition: (data: { reflectionScore: number }) => data.reflectionScore >= 4,
    tag: '后悔免疫者',
    description: '你的每个决定都经得起时间的考验。要么选得对，要么忘得快，总之绝不后悔。'
  },
  {
    condition: (data: { completedCount: number }) => data.completedCount >= 3 && data.completedCount < 10,
    tag: '选择实验员',
    description: '你在纠结的道路上稳步前进，每一个决策都是一次大胆的人生实验。'
  },
  {
    condition: (data: { completedCount: number; longTermCount: number }) => data.completedCount > 0 && data.longTermCount === 0,
    tag: '快刀斩乱麻侠',
    description: '小事速战速决，绝不拖泥带水。人生苦短，纠结什么的都是浪费时间。'
  },
  {
    condition: (data: { economicWeight: number }) => data.economicWeight > 20 && data.economicWeight <= 40,
    tag: '佛系随缘玩家',
    description: '钱不钱的无所谓，主要是图个开心。你的决策字典里写着四个字：都行，可以。'
  },
  {
    condition: (data: { avgDriftRate: number; completedCount: number }) => data.completedCount >= 2 && data.avgDriftRate >= 10 && data.avgDriftRate <= 25,
    tag: '稳定型纠结大师',
    description: '你纠结得很有规律，波动幅度可控。虽然慢，但最终总能做出决定。'
  },
  {
    condition: (data: { reflectionScore: number }) => data.reflectionScore > 0 && data.reflectionScore < 3,
    tag: '选择性失忆症患者',
    description: '做完决定就后悔，但过两天又忘了。你的记忆系统自带后悔自动清除功能。'
  },
  {
    condition: (data: { completedCount: number }) => data.completedCount === 1,
    tag: '初入纠结江湖',
    description: '你刚刚踏入纠结的世界，一切才刚刚开始。未来还有无数选择等着你。'
  },
  {
    condition: (data: { completedCount: number; longTermCount: number }) => data.completedCount >= 5 && data.longTermCount >= 3,
    tag: '人生战略家',
    description: '你习惯用深度思考面对重大选择，每一步都走得很认真。毕竟人生没有撤回键。'
  },
];

export const STORAGE_KEY = 'acme_lab_data';
