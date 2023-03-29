$(document).ready(function() {
    let guesses = 0;
    let randomAgent;
    $.getJSON('/agent.html', function (randomNumber) {
        randomAgent = randomNumber.number;
    })
    $.getJSON('json/agents.json', function(data) {
        let data2 = data.slice();
        $('#agentsField').autocomplete({
            source: function(request, response) {
                let filteredData = data2.filter(function(item) {
                    return item.name.toLowerCase().startsWith(request.term.toLowerCase());
                });
                let suggestions = filteredData.map(function(item) {
                    return item.name;
                });
                response(suggestions);
            },
            minLength: 1,
            select: function(event, ui) {
                let agent = data.filter(function(item) {
                    return item.name == ui.item.value;
                });
                let searchedAgent = data[randomAgent];

                revealGuess(agent[0], searchedAgent);

                $('#guess-' + guesses + ' div').each(function(index) {
                    $(this).delay(500 * index).animate({
                        opacity: 1
                    }, 500);
                }).promise().done(function() {
                    if (checkWinCon(agent[0], searchedAgent) === true) {
                        revealWin();
                        $('#agentsField').val('');
                    } else {
                        data2.splice(agent[0].id, 1);
                        guesses++;
                        $('#agentsField').val('');
                    }
                });
            }
        });
    });
    function revealGuess(agent, searchedAgent) {

        $('#results').prepend('<div class="flex flex-wrap" id="guess-' + guesses + '">')
        $('#guess-' + guesses).append('<div class="bg-gray-900 text-white w-32 h-32 mx-5 mt-5 flex items-center justify-center border" style="opacity: 0;"><img src="' + agent['img'] + '" alt="' + agent['name'] + '"></div>')
        $.each(agent, function(key, value) {
            if (key == 'id' || key == 'name' || key == 'img') {
                return true;
            }
            if (searchedAgent[key] == value) {
                $('#guess-' + guesses).append('<div class="bg-green-400 w-32 h-32 mx-5 mt-5 flex items-center justify-center border" style="opacity: 0;">' + value + '</div>')
            } else {
                $('#guess-' + guesses).append('<div class="bg-red-400 w-32 h-32 mx-5 mt-5 flex items-center justify-center border" style="opacity: 0;">' + value + '</div>')
            }
        });
    }

    function checkWinCon(agent, searchedAgent) {
        if (agent == searchedAgent) {
            return true;
        }
    }

    function revealWin() {
        alert('YOU WON');
    }
});