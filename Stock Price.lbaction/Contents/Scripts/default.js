// LaunchBar Action Script

function run()
{
    LaunchBar.openURL('http://finance.yahoo.com');
}

function runWithString(argument)
{
    var data = HTTP.getJSON('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%27http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D' + encodeURIComponent(argument) + '%26f%3Dnl1c1%26e%3D.csv%27%20and%20columns%3D%27name%2cprice%2cchange%27&format=json&diagnostics=false&callback=');

    if (typeof data === 'undefined' || typeof data.data === 'undefined') {
        LaunchBar.log('HTTP.getJSON() returned undefined');
        return [];
    }

    data = data.data;

    try {
        var suggestions = [];

        if (data.query && data.query.results) {
            suggestions.push({
                'title' : (data.query.results.row.price > 0 ? '$ ' : '') + data.query.results.row.price,
                'subtitle': data.query.results.row.name,
                'icon' : (data.query.results.row.change.substr(0, 1) === '+' ? 'positive' : 'negative') + '.icns',
                'action': 'openStock',
                'actionArgument': argument,
                'actionRunsInBackground': true,
                'actionReturnsItems': false,
                'alwaysShowsSubtitle': true
            });
        }

        return suggestions;
    } catch (exception) {
        LaunchBar.log('Exception while parsing result: ' + exception);
        return [];
    }
}

function openStock(argument) {
    LaunchBar.openURL('http://finance.yahoo.com/quote/' + encodeURIComponent(argument));
}
