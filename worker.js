var amqp = require('amqp');

function main( workerID )
    {
    var connection = amqp.createConnection({host: 'localhost'});
    var workerStr = workerID ? "W["+ workerID +"]" : "";

    connection.on('ready', function()
        {
        connection.queue('task_queue', {autoDelete: false, durable: true}, function(queue)
            {
            console.log('[*] Waiting for messages. To exit press CTRL+C');
            queue.subscribe({ack: true, prefetchCount: 1}, function (json, headers, info, message)
                {
                var body = json.data.toString('utf-8');
                console.log(" [*]%s Received %s", workerStr, body);
                setTimeout( function() 
                    {                    
                    var rnd = Math.floor((Math.random()*3)+1);
                    if ( rnd == 2 )
                        {
                        console.log( "   [x]%s Failed %s", workerStr, body );
                        message.reject(true);
                        //queue.shift(true, true); // NOT WORK: https://github.com/postwait/node-amqp/issues/210
                        }
                    else
                        {                
                        console.log( "   [√]%s Done %s", workerStr, body );
                        queue.shift(); // basic_ack equivalent
                        }
                    }, 3000 );
                });
            });
        });
    }


if (require.main === module)     
    main();
else 
    exports.create = main;

