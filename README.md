<img width="1280" height="640" alt="banner" src="Add your project banner image link here" />

# MoodPet POMPOM 🎯


## Basic Details
### Team Name: BUG & HUG


### Team Members
- Team Lead: Devananda Jigeesh - Government Engineering College Thrissur
- Member 2: Anirudh Sekhar - Government Engineering College Thrissur

### Project Description
A round, fluffy chatbot companion (a chibi bunny-cat named Pompom) that answers your questions — but only ever through the lens of whatever mood it's currently in. Ask it something simple and you might get a five-paragraph ramble, a one-word grumble, or a full theatrical monologue before it actually answers.

### The Problem (that doesn't exist)
Every chatbot on Earth answers you calmly, consistently, and helpfully every single time — which is frankly unrealistic and emotionally dishonest. Nobody, human or AI, is that stable. The world desperately needs a chatbot that reflects the honest, chaotic emotional range of an actual living creature having an actual day.

### The Solution (that nobody asked for)
We built Pompom: a chatbot pet whose mood is randomized the second you open a chat and then drifts based on how you treat it. Be rude, and it gets snippy and gives you the bare minimum. Be kind, and it might bounce off the walls with excitement and never quite finish its point. It can even refuse to answer at all until you say something nice to it first. The pet's face, the background color, and its whole personality shift live to match — because why should a chatbot's mood be your problem to manage, when it can be the whole point?

## Technical Details
Technologies/Components Used

For Software:

    Languages used: TypeScript / JavaScript, HTML, CSS

    Frameworks used: React (frontend), Node.js/Express (backend proxy)

    Libraries used: Google Gemini API (structured/schema-constrained response generation for mood + reply), CSS animations for pet expressions and background transitions

    Tools used: VS Code, Git/GitHub, npm

### Technologies/Components Used
For Software:
- **Languages used:** TypeScript / JavaScript, HTML, CSS
- **Frameworks used:** React (frontend), Node.js/Express (backend proxy)
- **Libraries used:** Google Gemini API (structured JSON output for mood state + reply text), CSS for pet sprite/expression animation and background color transitions
- **Tools used:** VS Code, Git/GitHub, npm

### Implementation
For Software:
# Installation
```bash
git clone [your-repo-link]
cd moodpet-pompom
npm install
```

# Run
```bash
npm run dev
# The app will be available at http://localhost:3000
```
*Note: Add your Gemini API key to a `.env` file before running (see `.env.example` if provided).*

### Project Documentation
For Software:

# Screenshots (Add at least 3)

[moods](assets/angry.png)
[moods](assets/bargainer.png)
[moods](assets/confused.png)
[moods](assets/dramatic.png)
[moods](assets/excited.png)
[moods](assets/overprotective.png)
[moods](assets/sad.png)
[moods](assets/shy.png)
[moods](assets/toddler.png)
These are the differnt moods of our pompom chatbot.We have differnt moods like sad,shy,angry,confused,dramatic,overprotective,excied,toddler,bargainer,etc..
# Diagrams

```mermaid
graph TD
    subgraph Client [Frontend - React / Vite]
        UI[User Interface]
        Speech[Browser Speech Synthesis]
    end

    subgraph Server [Backend - Vercel Serverless]
        API[Express Router: /api/chat]
        MoodSystem[Mood Validation & Prompt Builder]
    end

    subgraph AI [External Services]
        Gemini[Google Gemini API]
    end

    UI -- "1. User Input" --> API
    API -- "2. Process Input & History" --> MoodSystem
    MoodSystem -- "3. System Prompt + User Input" --> Gemini
    Gemini -- "4. JSON Response (Text, Mood, Catch Type)" --> MoodSystem
    MoodSystem -- "5. Validate Mood & Fallbacks" --> API
    API -- "6. Return JSON Data" --> UI
    UI -- "7. Play Voice" --> Speech



### Project Demo
[moods](assets/Meet%20Mochi%20—%20The%20Useless%20Chatbot%20-%20Google%20Chrome%202026-09-12%2007-33-38.mp4)



## Team Contributions
- **Devananda Jigeesh**: Add contribution details here
- **Anirudh Sekhar**: Add contribution details here

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)
