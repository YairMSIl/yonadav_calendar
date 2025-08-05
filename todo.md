[ ] Fix the display for the hebrew dates. We only need the name of month of the first of the hebrew month and the rest should only be the day of month
Example part of the API:
 "2025-09-05": {
            "hy": 5785,
            "hm": "Elul",
            "hd": 12,
            "hebrew": "י״ב בֶּאֱלוּל תשפ״ה",
            "heDateParts": {
                "y": "תשפ״ה",
                "m": "אלול",
                "d": "י״ב"
            },
            "events": [
                "Parashat Ki Teitzei"
            ]
        },

So, we need the heDateParts at "m" for the first of the month ("hd"=1) and we only need the heDateParts.d for the rest (including the first of the month)