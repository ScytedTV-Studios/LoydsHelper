const axios = require('axios');
const ical = require('ical');
require('dotenv').config();

const icalUrl = 'https://calendar.google.com/calendar/ical/c13497d3db6136714b6c353eb6ef27354563e2a08def9326abd16507824ce4e2%40group.calendar.google.com/public/basic.ics';
const apiUrl = 'https://api.scyted.tv/v1/parties/events';
const apiToken = process.env.SCYTEDTV_API;

async function fetchAndProcessEvents() {
    try {
        const response = await axios.get(icalUrl);
        const data = response.data;

        const parsedData = ical.parseICS(data);
        const currentEpoch = Math.floor(Date.now() / 1000);

        const events = [];
        let eventCounter = 1;

        const extractFrontMatter = (description) => {
            const result = {};

            const linkRegex = /<a\s+[^>]*>([^<]+)<\/a>/g;
            let match;

            while ((match = linkRegex.exec(description)) !== null) {
                const urlText = match[1].trim();
                if (urlText.includes('cdn.scyted.tv/dropout/event-banner')) {
                    result.cover = urlText;
                } else if (urlText.includes('cdn.scyted.tv/website-assets/company-logos')) {
                    result.logo = urlText;
                }
            }

            const otherMatches = description.match(/(\b(?:color|studio)="[^"]+")/g);
            if (otherMatches) {
                otherMatches.forEach((match) => {
                    const [key, value] = match.split('=');
                    result[key.trim()] = value.replace(/"/g, '').trim();
                });
            }

            return result;
        };

        for (const key in parsedData) {
            const event = parsedData[key];
            if (event.type !== 'VEVENT') continue;

            const startDate = new Date(event.start);
            const epoch = Math.floor(startDate.getTime() / 1000);

            const endDate = event.end ? new Date(event.end) : null;
            const endEpoch = endDate ? Math.floor(endDate.getTime() / 1000) : null;
            const duration = endEpoch ? endEpoch - epoch : 0;

            const eventName = event.summary || 'Unnamed Event';

            if (eventName.startsWith("🔒") || eventName.startsWith('[Event]')) {
                continue;
            }

            const frontMatter = event.description ? extractFrontMatter(event.description) : {};

            if ((epoch >= currentEpoch) || (endEpoch && currentEpoch >= epoch && currentEpoch <= endEpoch)) {
                const eventObject = {
                    id: `event${eventCounter}`,
                    name: eventName,
                    epoch: epoch,
                    ...frontMatter
                };

                if (endEpoch && duration >= 600) {
                    eventObject.endEpoch = endEpoch;
                }

                events.push(eventObject);
                eventCounter++;
            }
        }

        const jsonContent = { events };

        await axios.post(apiUrl, jsonContent, {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            }
        });

        // console.log(`Events successfully sent to ${apiUrl}`);
    } catch (error) {
        console.error('Error fetching or processing events:', error);
    }
}

setInterval(fetchAndProcessEvents, 10000);

fetchAndProcessEvents();