interface HeuristicResult {
  points: number;
  flag: string;
}

interface RiskScoreResult {
  riskScore: number;
  flags: string[];
}

const SPAM_WORDS: string[] = [
  'buy now', 'click here', 'subscribe', 'free money', 'earn cash',
  'limited offer', 'act now', 'call now', 'don\'t miss', 'exclusive deal',
  'guaranteed', 'congratulations', 'you\'re a winner', 'spam', 'viagra',
  'casino', 'lottery', 'prize', 'win big', 'cheap',
];

class RiskScoringService {
  public calculateRiskScore(text: string): RiskScoreResult {
    let score = 0;
    const flags: string[] = [];

    const heuristics: HeuristicResult[] = [
      this.checkSpamWords(text),
      this.checkExcessiveUppercase(text),
      this.checkMultipleExclamationMarks(text),
      this.checkShortOrMeaninglessText(text),
      this.checkRepeatedCharacters(text),
    ];

    for (const result of heuristics) {
      score += result.points;
      if (result.flag) flags.push(result.flag);
    }

    score = Math.max(0, Math.min(100, score));

    return { riskScore: score, flags };
  }

  private checkSpamWords(text: string): HeuristicResult {
    const lowerText = text.toLowerCase();
    const found = SPAM_WORDS.some((word) => lowerText.includes(word));
    if (found) {
      return { points: 30, flag: 'Contains spam or banned words' };
    }
    return { points: 0, flag: '' };
  }

  private checkExcessiveUppercase(text: string): HeuristicResult {
    const letters = text.replace(/[^a-zA-Z]/g, '');
    if (letters.length === 0) return { points: 0, flag: '' };
    const upperCount = (letters.match(/[A-Z]/g) || []).length;
    const upperRatio = upperCount / letters.length;
    if (upperRatio > 0.5) {
      return { points: 20, flag: 'Excessive use of uppercase characters' };
    }
    return { points: 0, flag: '' };
  }

  private checkMultipleExclamationMarks(text: string): HeuristicResult {
    const matches = text.match(/!{3,}/g);
    if (matches) {
      return { points: 15, flag: 'Multiple consecutive exclamation marks' };
    }
    return { points: 0, flag: '' };
  }

  private checkShortOrMeaninglessText(text: string): HeuristicResult {
    const cleaned = text.trim();
    if (cleaned.length < 10) {
      return { points: 25, flag: 'Very short or potentially meaningless review text' };
    }
    return { points: 0, flag: '' };
  }

  private checkRepeatedCharacters(text: string): HeuristicResult {
    const repeated = text.match(/(.)\1{4,}/g);
    if (repeated) {
      return { points: 20, flag: 'Contains repeated characters (suspicious pattern)' };
    }
    return { points: 0, flag: '' };
  }
}

export default new RiskScoringService();
