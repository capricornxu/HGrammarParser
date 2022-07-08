$(document).ready(function(){

    // jQuery methods go here...
    $('.example').click(function(){     
        $('#txt').val($(this).text());
        // $('#txt').trigger('input');
        return false;
    });

    function displayTree(tree) {
        if (!tree.subtrees || tree.subtrees.length == 0) {
            return '<li><a href="#">' + tree.root + '</a></li>';
        }
        var builder = [];
        builder.push('<li><a href="#">');
        builder.push(tree.root);
        builder.push('</a>')
        builder.push('<ul>')
        for (var i in tree.subtrees) {
            builder.push(displayTree(tree.subtrees[i]))
        }
        builder.push('</ul>')
        builder.push('</li>')
        // console.log(builder);
        return builder.join('');
    }

    function allindexof(array,element){
        var index = [];
          for (i = 0; i < array.length; i++){
            if (array[i] === element) {  
              index.push(i);
            }
          }
        return index;
    }

    // replace element of specific index
    String.prototype.replaceAt = function(index, replacement) {
        return this.substring(0, index) + replacement + this.substring(index + replacement.length);
    }

    function addESaround(string, symbol){
        // console.log(symbol);
        const index = allindexof(string, symbol);
        // console.log(index);
        for(var i in index){
            const index = allindexof(string, symbol);
            if(index[i] >= 0){
                if(string[index[i]-1] != ' '){
                    string = string.slice(0, index[i]) + ' ' + string.slice(index[i]);
                    index[i] = index[i] + 1;
                }
                // console.log(string[index[0]]);
                if(string[index[i]+1] != ' '){
                    string = string.slice(0, index[i]+1) + ' ' + string.slice(index[i]+1);
                    index[i] = index[i] + 1;
                }
            }
        }
        return string;
    }

    function eliminateQuotes(string){
        // console.log(string);
        var quote_index = allindexof(string, "'")
        for(var i in allindexof(string, "'")){
            if(i % 2 == 0){
                string = string.replaceAt(quote_index[i] + 1, "#");
            }
        }
        string = string.split("'");
        for(var i in string){
            if(string[i][0] == '#'){
                string[i] = 'string';
            }
        }
        string = string.join('');

        return string;
    }

    function eliminateNum(string){
        let num_reg = /\d+\.*\d*/g;
        let num_match = string.match(num_reg);
        for(var i in num_match){
            if(string.indexOf(num_match[i]) >= 0){
                let num_index = string.indexOf(num_match[i]);
                let num_len = num_match[i].length;
                string = string.slice(0, num_index) 
                            + 'number' 
                            + string.slice(num_index+num_len, string.length);
            }
        }

        return string;
    }

    function getTsymbol(rules){
        const terminal_symbols = [];
        rules = rules.trim().split('\n');
        // console.log(rules); 
        for(var i in rules){
            var rule = rules[i];
            // console.log(rule);
            var parts = rule.split('->');
            // console.log(parts);
            var rhss = parts[1].trim();
            var rhssParts = rhss.split('|');
            // console.log(rhssParts);
            for(var j in rhssParts){
                terminal_symbols.push(rhssParts[j].trim()) ;
            }
        }

        return terminal_symbols;
    }

    String.prototype.splitbytokens = function(tokens){
        str = this;
        str = str.replace(/\s/g, "");
        str = str.match(tokens);

        return str;
    }

    $('#btn1').click(function(){
        var s = $('#txt').val();

        var tokenStream = s;

        // replace the first element in quotes with #
        var quote_index = allindexof(tokenStream, "'")
        for(var i in allindexof(tokenStream, "'")){
            if(i % 2 == 0){
                tokenStream = tokenStream.replaceAt(quote_index[i] + 1, "#");
            }
        }

        // tramsform quotes to 'string'
        tokenStream = tokenStream.split("'");
        for(var i in tokenStream){
            if(tokenStream[i][0] == '#'){
                tokenStream[i] = 'string';
            }
        }
        tokenStream = tokenStream.join('');
        // var test_token = tokenStream.slice();

        // add empty space around brackets and parentheses
        // console.log(tokenStream);
        tokenStream = addESaround(tokenStream, "[");
        tokenStream = addESaround(tokenStream, "]");
        tokenStream = addESaround(tokenStream, "(");
        tokenStream = addESaround(tokenStream, ")");
        // console.log(tokenStream);
        tokenStream = tokenStream.trim().split(' ');

        // detect number
        for(var i in tokenStream){
            if(!isNaN(tokenStream[i])){
                tokenStream[i] = 'number';
            }
        }
        console.log(tokenStream);   

        var test_token = s.trim();
        console.log(test_token);
        // tramsform quotes to 'string' and number to 'number'
        test_token = eliminateQuotes(test_token);
        test_token = eliminateNum(test_token);
        console.log(test_token);
        // tokenize rules
        termnal_rules = $('#tgrm').val();
        console.log(termnal_rules);
        var terminal_symbols = getTsymbol(termnal_rules);
        console.log(terminal_symbols);
        // split by tokens
        test_token = test_token.splitbytokens(terminal_symbols);
        // test_token = test_token.replace(/\s/g, "");
        console.log(test_token);

        const p = document.getElementById('test');
        rules = p.textContent + $('#tgrm').val();
        // console.log(test_rules);
        rules = rules.trim().split('\n');
        console.log(rules);

        var grammar = new tinynlp.Grammar(rules);
        
        var rootProduction = 'hypo';
        var chart = tinynlp.parse(tokenStream, grammar, rootProduction);

        var state = chart.getFinishedRoot(rootProduction);
        console.log(state);
        
        if (state) {
            $("#p1").html("<span style='color: green;'>Valid</span>");
            var trees = state.traverse();
            $('#dv').empty();
            // console.log(trees);
            $('#dv').append('<div class="tree" id="displayTree"><ul>' + displayTree(trees[0]) + '</ul></div></br>');
        }
        else{
            $("#p1").html("<span style='color: red;'>Invalid</span>");
            $("#dv").html("");
        }
    })
  });

  