import ast
# import astunparse # Optional, for debugging ASTs as strings

def get_ast_tokens(code):
    """
    Parses Python code into an AST and extracts a more granular token sequence,
    including operator types.

    Args:
        code (str): Python code as a string.

    Returns:
        list: A list of strings representing AST node types, including specific operators.
              Returns None if there is a syntax error.
    """
    try:
        tree = ast.parse(code)
        tokens = []

        def traverse_ast(node):
            if isinstance(node, ast.BinOp):
                tokens.append(type(node.op).__name__)  # Capture operator type (Add, Mult, etc.)
            else:
                tokens.append(type(node).__name__)  # Add general node type

            for child in ast.iter_child_nodes(node):
                traverse_ast(child)

        traverse_ast(tree)
        return tokens
    except SyntaxError:
        return None  # Indicate syntax error

# Example usage (for testing purposes)
if __name__ == '__main__':
    sample_code = """
    def my_function(a, b):
        if a > b:
            return a + b
        else:
            return b - a
    """
    ast_tokens = get_ast_tokens(sample_code)
    if ast_tokens:
        print("AST Tokens:", ast_tokens)
        # Optional: Print AST as string for debugging
        # print("\nAST String:")
        # print(astunparse.unparse(ast.parse(sample_code)))
    else:
        print("Syntax Error in code.")