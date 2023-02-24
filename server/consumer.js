const Kafka = require("node-rdkafka");
const mailer = require("./utils/mailer");

var consumer = new Kafka.KafkaConsumer(
    {
        "group.id": "kafka",
        "metadata.broker.list": "localhost:9092",
    },
    {}
);

consumer.connect();

consumer
    .on("ready", () => {
        console.log("consumer ready..");
        consumer.subscribe(["mail"]);
        consumer.consume();
    })
    .on("data", function (data) {
        const message = JSON.parse(data.value);
        console.log(message.to, message.attachment.length)
        mailer(message.to, message.attachment.moderator, message.attachment.superuser);
    });