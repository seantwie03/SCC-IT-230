/**
 * Keep local Slidev servers on their assigned ports.
 *
 * Vite normally advances to another port when the requested port is occupied.
 * Failing instead makes a stale or conflicting process visible and prevents
 * development and agent-review servers from accumulating on unknown ports.
 */
export default {
    server: {
        strictPort: true,
    },
};
