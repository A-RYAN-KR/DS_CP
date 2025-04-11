from collections import Counter
import math

def cosine_similarity(tokens1, tokens2):
    """
    Calculates cosine similarity between two lists of tokens.

    Args:
        tokens1 (list): List of tokens for code snippet 1.
        tokens2 (list): List of tokens for code snippet 2.

    Returns:
        float: Cosine similarity score (between 0 and 1).
               Returns 0 if either token list is empty.
    """
    if not tokens1 or not tokens2:
        return 0.0  # Handle empty token lists

    counter1 = Counter(tokens1)
    counter2 = Counter(tokens2)

    dot_product = 0
    norm1 = 0
    norm2 = 0

    # Calculate dot product and norms
    for token in set(counter1.keys()) | set(counter2.keys()): # Iterate over all unique tokens
        count1 = counter1.get(token, 0)
        count2 = counter2.get(token, 0)
        dot_product += count1 * count2
        norm1 += count1 ** 2
        norm2 += count2 ** 2

    if norm1 == 0 or norm2 == 0: # Handle cases where one of the norms is zero (all counts are zero)
        return 0.0

    return dot_product / (math.sqrt(norm1) * math.sqrt(norm2))

# Example usage (for testing purposes)
if __name__ == '__main__':
    tokens_a = ['FunctionDef', 'arguments', 'arg', 'If', 'Compare', 'Name', 'Constant', 'Return', 'BinOp', 'Name', 'Name', 'Else', 'Return', 'BinOp', 'Name', 'Name']
    tokens_b = ['FunctionDef', 'arguments', 'arg', 'If', 'Compare', 'Name', 'Constant', 'Return', 'BinOp', 'Name', 'Name', 'Else', 'Return', 'BinOp', 'Name', 'Name']
    tokens_c = ['FunctionDef', 'arguments', 'arg', 'Return', 'Constant']

    similarity_ab = cosine_similarity(tokens_a, tokens_b)
    similarity_ac = cosine_similarity(tokens_a, tokens_c)

    print(f"Similarity between tokens_a and tokens_b: {similarity_ab:.4f}") # Should be close to 1
    print(f"Similarity between tokens_a and tokens_c: {similarity_ac:.4f}") # Should be lower