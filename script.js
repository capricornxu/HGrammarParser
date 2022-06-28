$(document).ready(function(){

    // jQuery methods go here...
    $('.example').click(function(){     
        $('#txt').val($(this).text());
        $('#txt').trigger('input');
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


    $('#txt').on('input', function() {
        var s = $(this).val();

        var tokenStream = s.trim().split(' ');
        console.log(tokenStream);

        // detect number and string
        for(var i in tokenStream){
            if(!isNaN(tokenStream[i])){
                tokenStream[i] = 'number';
            }
            
            if(tokenStream[i][0] == "'"){
                tokenStream[i] = 'string';
            }
        }




        var rules = $('#tgrm').val() + $('#ntgrm').val();
        rules = rules.trim().split('\n');
        console.log(rules);

        var grammar = new tinynlp.Grammar(rules);
        
        var rootProduction = 'hypo';
        var chart = tinynlp.parse(tokenStream, grammar, rootProduction);

        var state = chart.getFinishedRoot(rootProduction);
        if (state) {
            var trees = state.traverse();
            console.log(displayTree(trees[0]));
            $('#dv').empty();
            for (var i in trees) {
                // console.log(JSON.stringify(trees[i]))
                $('#dv').append('<div class="tree" id="displayTree"><ul>' + displayTree(trees[i]) + '</ul></div></br>');
            }
        }
    });
  });

  