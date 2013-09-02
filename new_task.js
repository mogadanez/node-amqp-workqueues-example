var amqp       = require('amqp');
var amqp_hacks = require('./amqp-hacks');

var connection = amqp.createConnection({host: 'localhost'});

var base_message = process.argv.slice(2).join(' ') || 'Test';

connection.on('ready', function(){
    connection.queue('task_queue', {autoDelete: false,
                                    durable: true}, function(queue){

            function queue( i )
                {
                var message = base_message +' '+ i;
                connection.publish('task_queue', message, {deliveryMode: 2});
                console.log(" [x] Sent %s", message);
                if ( i< 10 )
                    {
                    setTimeout( function(){queue(i+1);}, 1000 );
                    }

                else
                   amqp_hacks.safeEndConnection(connection);    
                }

            queue(1);
     });
});
