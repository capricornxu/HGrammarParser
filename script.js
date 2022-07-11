const special_symbols = ['(', ')', '[', ']', '&', ','];

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

    function getIndicesOf(searchStr, str, caseSensitive) {
        var searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        var startIndex = 0, index, indices = [];
        if (!caseSensitive) {
            str = str.toLowerCase();
            searchStr = searchStr.toLowerCase();
        }
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    }

    String.prototype.splitbytokens = function(tokens){
        str = this;
        str = str.replace(/\s/g, "");
        var indices = []
        for(var i in tokens){
            indices.push(getIndicesOf(tokens[i], str));
        }
        indices = indices.flat().sort(function(a, b){return a - b}).reverse();
        indices = indices.filter((c, index) => {
            return indices.indexOf(c) === index;
        });
        // console.log(uniqueChars);
        console.log(indices);
        for(var i in indices){
            str = str.slice(0, indices[i]) + '-|-' + str.slice(indices[i], str.length);
        }
        str = str.split('-|-');
        str = str.slice(1, str.length);

        return str;
    }

    $('#btn1').click(function(){
        var s = $('#txt').val(); 

        const p = document.getElementById('test');
        rules = p.textContent + $('#tgrm').val();
        rules = rules.trim().split('\n');
        console.log(rules);

        var tokenstream = s.trim();
        console.log(tokenstream);
        // tramsform quotes to 'string' and number to 'number'
        tokenstream = eliminateQuotes(tokenstream);
        tokenstream = eliminateNum(tokenstream);
        console.log(tokenstream);
        // tokenize rules
        termnal_rules = $('#tgrm').val();
        console.log(termnal_rules);
        var terminal_symbols = getTsymbol(termnal_rules);
        terminal_symbols = terminal_symbols.concat(special_symbols);
        console.log(terminal_symbols);
        // split by tokens
        tokenstream = tokenstream.splitbytokens(terminal_symbols);
        console.log(tokenstream);

        var grammar = new tinynlp.Grammar(rules);
        
        var rootProduction = 'hypo';
        var chart = tinynlp.parse(tokenstream, grammar, rootProduction);

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

  