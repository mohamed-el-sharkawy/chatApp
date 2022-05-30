import moment from 'moment';

function formatMessages(username: string, text: string) {
    return {
        username,
        text,
        time: moment().format('h:mm a'),
    };
}

export { formatMessages };
