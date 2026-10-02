const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const extractTimetableFromImage = async (
  fileBuffer,
  mimeType
) => {
  if (!fileBuffer) {
    throw new Error("Timetable image is required.");
  }

  if (!mimeType || !mimeType.startsWith("image/")) {
    throw new Error("Please upload a valid timetable image.");
  }

  const prompt = `
You are a timetable extraction assistant for a college student.

Read the uploaded timetable image carefully and extract every class that can
be clearly identified.

For each timetable entry, return:
- day: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday
- subject: subject name
- startTime: class start time in 24-hour HH:MM format
- endTime: class end time in 24-hour HH:MM format
- room: classroom or lab number/name if visible, otherwise ""
- type: Lecture, Lab, Tutorial, or Other

Important rules:
1. Do not invent information.
2. If a room is not visible, use an empty string.
3. Convert times such as 9:00 AM to 09:00.
4. Extract only classes that are actually visible.
5. If a cell contains multiple classes, separate them correctly.
6. Return an empty entries array if no timetable classes can be identified.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",

      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType,
                data: fileBuffer.toString("base64"),
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",

          properties: {
            entries: {
              type: "array",

              items: {
                type: "object",

                properties: {
                  day: {
                    type: "string",
                    enum: [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ],
                  },

                  subject: {
                    type: "string",
                  },

                  startTime: {
                    type: "string",
                  },

                  endTime: {
                    type: "string",
                  },

                  room: {
                    type: "string",
                  },

                  type: {
                    type: "string",
                    enum: [
                      "Lecture",
                      "Lab",
                      "Tutorial",
                      "Other",
                    ],
                  },
                },

                required: [
                  "day",
                  "subject",
                  "startTime",
                  "endTime",
                  "room",
                  "type",
                ],
              },
            },
          },

          required: ["entries"],
        },
      },
    });

    if (!response || !response.text) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    let parsed;

    try {
      parsed = JSON.parse(response.text);
    } catch (error) {
      console.error(
        "Gemini returned invalid JSON:",
        response.text
      );

      throw new Error(
        "The timetable could not be interpreted correctly."
      );
    }

    if (
      !parsed ||
      !Array.isArray(parsed.entries)
    ) {
      throw new Error(
        "Gemini returned an invalid timetable format."
      );
    }

    return parsed.entries;
  } catch (error) {
    console.error(
      "Timetable scanner service error:",
      error
    );

    // Do NOT retry quota exhaustion.
    if (
      error?.status === 429 ||
      error?.code === 429 ||
      error?.message?.includes(
        "RESOURCE_EXHAUSTED"
      ) ||
      error?.message?.includes(
        "current quota"
      ) ||
      error?.message?.includes(
        "free_tier_requests"
      )
    ) {
      throw new Error(
        "Gemini's current API quota has been exhausted. The timetable scanner will work again when the quota becomes available."
      );
    }

    if (
      error?.status === 401 ||
      error?.status === 403
    ) {
      throw new Error(
        "Gemini API authentication failed. Please check the Gemini API configuration."
      );
    }

    throw new Error(
      error?.message ||
        "Failed to scan timetable."
    );
  }
};

module.exports = {
  extractTimetableFromImage,
};