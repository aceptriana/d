import axios from 'axios';

const API_BASE = 'https://dramabox-api-rho.vercel.app';
const BOOK_ID = '41000122558';

async function test() {
    try {
        console.log('Fetching chapters...');
        const chatpersRes = await axios.get(`${API_BASE}/api/chapters/${BOOK_ID}`);
        // console.log('Chapters response:', JSON.stringify(chatpersRes.data, null, 2).substring(0, 500));

        const chapters = Array.isArray(chatpersRes.data) ? chatpersRes.data : chatpersRes.data.list;
        const firstEp = chapters[0];
        console.log('First Chapter:', firstEp);

        const epParam = firstEp.id || 1;
        console.log(`Testing stream for Book ${BOOK_ID}, Episode ${epParam}`);

        const streamRes = await axios.get(`${API_BASE}/api/stream`, {
            params: { bookId: BOOK_ID, episode: epParam }
        });
        console.log('Stream Response Status:', streamRes.status);
        console.log('Stream Data:', streamRes.data);

    } catch (err) {
        console.error('Error:', err.message);
        if (err.response) {
            console.error('Response data:', err.response.data);
        }
    }
}

test();
