/**
 * @typedef {'user' | 'bot'} Sender
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} content
 * @property {Sender} sender
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} QuickReply
 * @property {string} id
 * @property {string} text
 * @property {string} query
 */

/**
 * @typedef {Object} ChatContextType
 * @property {Message[]} messages
 * @property {boolean} isTyping
 * @property {(content: string, sender: Sender) => void} addMessage
 * @property {(content: string) => void} sendMessage
 * @property {() => void} clearMessages
 */
