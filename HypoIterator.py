from nltk.parse.generate import generate, demo_grammar
from nltk import CFG

# hypo_string = """root -> hypo
#         hypo -> '(' expr op expr ')' '[' pred ']' | expr op expr | hypo '&' hypo
#         expr -> func '(' subexpr ')' | var
#         subexpr -> expr | subexpr ',' subexpr | ' '
#         var -> attr | '(' attr ')' '[' pred '] '| const
#         pred -> var op const | pred '&' pred
#         op -> '=' | '<' | '>' 
#         attr -> 'Title' | 'Year' | 'Genre' | 'Rating' | 'Cost' | 'Market'
#         const -> 'number' | 'string'
#         func -> 'AVG' | 'KS' | 'LM' | 'SRES' | 'MAX' | 'SUB' | 'COUNT'
#         """
hypo_string = """root -> hypo
        hypo -> '(' expr op expr ')' '[' pred ']' | expr op expr
        expr -> func '(' subexpr ')' | var
        subexpr -> var | ' '
        var -> attr | const
        pred -> var op const
        op -> '=' | '<' | '>' 
        attr -> 'Title' | 'Year' | 'Genre' | 'Rating' | 'Cost' | 'Market'
        const -> 'number' | 'string'
        func -> 'AVG' | 'KS' | 'LM' | 'SRES' | 'MAX' | 'SUB' | 'COUNT'
        """

hypo_grammar = CFG.fromstring(hypo_string)

length = 0

with open('hypotheses_nr8.txt','w') as file:
    for n, sentence in enumerate(generate(hypo_grammar, depth = 8), 1):
        print("%3d. %s" % (n, " ".join(sentence)))
        file.write(' '.join(sentence))
        file.write('\n')
        file.flush()
        length = n

print("number of hypothesis is", length)