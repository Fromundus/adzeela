export const containsKeyword = (word: string, keywords: any[]): boolean => {

    const containsKeyword = keywords.some(
        keyword => word.toLowerCase().includes(keyword.toLowerCase())
    );

    return containsKeyword;
  };