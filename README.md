# Transcripter

Transcripter transcribes meetings in real-time, allowing you to easily record what is said and search the transcript after the fact.

The website allows you to log in, create a meeting, and invite people to it. Once everyone has joined, the transcription of each connected user starts with the push of a button. You can pause the meeting and stop it once it's over, after which point you can download a PDF or text version of the complete transcript. Transcripts are per-user, making it easy to see exactly who said what at any point during the meeting.

## Creation

Transcripter was largely created over two days at HACK UCSC in January 2016 by Arnaud Gallardo ([@ArnaudGallardo](https://github.com/ArnaudGallardo)) and Teo Fleming ([@mokolodi1](https://github.com/mokolodi1)). Small additions were made after the hackathon in preparation for the UCSC Business Design Showcase.

## Reception

Transcripter won 2nd place at HACK UCSC 2016 ($4825 in cash and prizes) and 2nd place at the UCSC Business Design Showcase in 2016 ($3000 in cash).

We presented Transcripter at the [Santa Cruz New Tech MeetUp](https://www.meetup.com/santacruznewtech/) and were immediately bombarded by users that wanted to join the beta. Unfortunately we stopped development on the project soon after due to time constraints. (Teo was working full-time at UCSC and Arnaud was a full-time student.)

![A picture of Teo and Arnaud](images/UCSC_BusinessDesignShowcase_Transcripter.jpg?raw=true "Winners!")

## Tech

We built Transcripter with Meteor and use Chrome's built-in transcription toolkit for the heavy lifting.

### How to start it

```sh
# install Meteor (instructions at https://www.meteor.com/install)
curl https://install.meteor.com/ | sh

# grab the code
git clone https://github.com/ArnaudGallardo/transcripter

# run it
cd transcripter
meteor
```
