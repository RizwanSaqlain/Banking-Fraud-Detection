import CursorEvent from '../models/cursorTrack.model.js';

const CursorEventHandler = async (req, res) => {
    try {
        const { sessionId, events } = req.body;

        // Validation
        if (!sessionId || !Array.isArray(events) || events.length === 0) {
            return res.status(400).json({ error: 'Missing sessionId or events array' });
        }

        // Check session count
        const sessionIds = await CursorEvent.distinct('sessionId');
        const sessionCount = sessionIds.length;
        if (sessionCount >= 100) {
            // Find and delete the oldest session
            const oldestSession = await CursorEvent.findOne().sort({ createdAt: 1 });
            if (oldestSession) {
                await CursorEvent.deleteMany({ sessionId: oldestSession.sessionId });
            }
        }

        // Save all events for this session
        const savedEvents = await CursorEvent.insertMany(
            events.map(ev => ({
                sessionId,
                time_ms: ev.time_ms,
                x: ev.x,
                y: ev.y
            }))
        );

        res.status(201).json({ message: 'Events saved', count: savedEvents.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default CursorEventHandler;