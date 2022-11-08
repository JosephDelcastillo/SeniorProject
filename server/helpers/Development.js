/**
 *  Development Helper Functions
 * 
 *  Help for Pre-Server Development 
 *  DO NOT INCLUDE IN PRODUCTION 
 */


/**
 *  DummyDB
 * 
 *  In place of an actually DB Connection 
 */
function DummyDB () {
    // Setup Tables
    let USER_TABLE = table.create(['name', 'email', 'password', 'role']);
    let QUESTION_TABLE = table.create([ 'name', 'is_note' ]);
    let SUBMIT_TABLE = table.create(['user', 'date']);
    let RESPONSE_TABLE = table.create([ 'submission', 'question', 'value' ]);
    let SESSION_TABLE = table.create(['user', 'start', 'role']);
    let ENTRIES_TABLE = table.create(['entryId','email','entryDate','lastEdit','editDate','role']);

    // Add Some Initial Data 
    USER_TABLE.addEntry({ name: 'Test User A', email: 'userA@email.com', password: 'passA', role: 'admin' });
    USER_TABLE.addEntry({ name: 'Test User B', email: 'userB@email.com', password: 'passB', role: 'staff' });
    USER_TABLE.addEntry({ name: 'Test User C', email: 'userC@email.com', password: 'passC', role: 'staff' });
    USER_TABLE.addEntry({ name: 'Test User D', email: 'userD@email.com', password: 'passD', role: 'staff' });
    USER_TABLE.addEntry({ name: 'Test User E', email: 'userE@email.com', password: 'passE', role: 'staff' });

    QUESTION_TABLE.addEntry({ name: 'Students Reached', is_note: 'false' });
    QUESTION_TABLE.addEntry({ name: 'Students Reached Note', is_note: 'true' });
    QUESTION_TABLE.addEntry({ name: 'Students Helped', is_note: 'false' });
    QUESTION_TABLE.addEntry({ name: 'Students Helped Note', is_note: 'true' });
    QUESTION_TABLE.addEntry({ name: 'Another Value', is_note: 'false' });
    QUESTION_TABLE.addEntry({ name: 'A Fourth Value', is_note: 'false' });

    ENTRIES_TABLE.addEntry({entryId: 1, email: 'userA@email.com', entryDate: '10/23/22', lastEdit: 'userA@email.com', editDate: '10/23/22', role: 'staff'});
    ENTRIES_TABLE.addEntry({entryId: 2, email: 'userA@email.com', entryDate: '10/20/22', lastEdit: 'adminA@email.com', editDate: '10/22/22', role: 'staff'});
    ENTRIES_TABLE.addEntry({entryId: 3, email: 'userA@email.com', entryDate: '10/21/22', lastEdit: 'userA@email.com', editDate: '10/21/22', role: 'staff'});
    ENTRIES_TABLE.addEntry({entryId: 4, email: 'userA@email.com', entryDate: '10/20/22', lastEdit: 'userA@email.com', editDate: '10/20/22', role: 'staff'});
    ENTRIES_TABLE.addEntry({entryId: 5, email: 'userA@email.com', entryDate: '10/19/22', lastEdit: 'userA@email.com', editDate: '10/19/22', role: 'staff'});
    ENTRIES_TABLE.addEntry({entryId: 6, email: 'userA@email.com', entryDate: '10/18/22', lastEdit: 'userA@email.com', editDate: '10/18/22', role: 'staff'});
    ENTRIES_TABLE.addEntry({entryId: 7, email: 'userB@email.com', entryDate: '10/23/22', lastEdit: 'userB@email.com', editDate: '10/23/22', role: 'staff'});
    ENTRIES_TABLE.addEntry({entryId: 8, email: 'userB@email.com', entryDate: '10/20/22', lastEdit: 'adminA@email.com', editDate: '10/22/22', role: 'staff'});
    ENTRIES_TABLE.addEntry({entryId: 9, email: 'userB@email.com', entryDate: '10/21/22', lastEdit: 'userB@email.com', editDate: '10/21/22', role: 'staff'});
    ENTRIES_TABLE.addEntry({entryId: 10, email: 'userB@email.com', entryDate: '10/20/22', lastEdit: 'userB@email.com', editDate: '10/20/22', role: 'staff'});
    ENTRIES_TABLE.addEntry({entryId: 11, email: 'userB@email.com', entryDate: '10/19/22', lastEdit: 'userB@email.com', editDate: '10/19/22', role: 'staff'});
    ENTRIES_TABLE.addEntry({entryId: 12, email: 'userB@email.com', entryDate: '10/18/22', lastEdit: 'userB@email.com', editDate: '10/18/22', role: 'staff'});

    SESSION_TABLE.addEntry({user: 'userA@email.com', start: '11/7/22 14:17', role: 'staff'});

    // Build a Bunch of Dummy Responses
    const USER_COUNT = 5;
    const ENTRIES_PER_USER = 8;

    // Loop Through Users
    for (let cur_user = 1; cur_user < (USER_COUNT + 1); cur_user++) {
        // Loop Through Entries
        for (let cur_entry = 1; cur_entry < (ENTRIES_PER_USER + 1); cur_entry++) {
            // FIRST - Add Entry to Log 
            SUBMIT_TABLE.addEntry({ user: cur_user, date: genDate() });
            const CUR = SUBMIT_TABLE.incrementPos;
            
            // Fill in Responses with Random Data 
            RESPONSE_TABLE.addEntry({ submission: CUR, question: 1, value: genVal() });
            RESPONSE_TABLE.addEntry({ submission: CUR, question: 2, value: 'Notes about Studets Reached' });
            RESPONSE_TABLE.addEntry({ submission: CUR, question: 3, value: genVal() });
            RESPONSE_TABLE.addEntry({ submission: CUR, question: 4, value: 'Notes About Students Helped' });
            RESPONSE_TABLE.addEntry({ submission: CUR, question: 5, value: genVal() });
            RESPONSE_TABLE.addEntry({ submission: CUR, question: 6, value: genVal() });
        }
    }

    // Return as object for use 
    return {
        Users: USER_TABLE,
        Questions: QUESTION_TABLE,
        Submissions: SUBMIT_TABLE,
        Responses: RESPONSE_TABLE,
        Sessions: SESSION_TABLE,
        Entries: ENTRIES_TABLE,
    };
};

function genVal (max = 200, min = 90) { return `${genNum(max, min)}`; }
function genNum (max = 100, min = 0) { return Math.floor((Math.random() * (max - min + 1)) + min) }
function f(val, len = 2) { return (val > 9) ? `${val}` : `0${val}`; }

function genDate () { return `20${genNum(22, 20)}-${f(genNum(12, 1))}-${f(genNum(30, 1))}`; }

/**
 * @class table
 * @type {Object}
 * @property {array}    columns - String of Column Names, ID is added automatically 
 * @property {array}    rows - Table Data 
 */
let table = {
    create: function (columns) {
        let obj = Object.create(this);
        obj.init(columns)
        return obj;
    },

    init: function (columns) {
        this.incrementPos = 0;
        this.columns = [ 'id', ...columns ];
        this.rows = [];
    },

    getEntryByID: function ( id ) { return this.rows.find(e => e.id === id); }, 

    addEntry: function ( data ) {
        this.incrementPos++;
        this.rows.push({ id: this.incrementPos, ...data });
    },

    removeEntryByID: function ( id ) {
        const I = this.rows.findIndex(e => e.id === id);
        return (I >= 0) ? this.rows.splice(I, 1) : false; 
    },

    updateEntry: function ({ id, column, value }) {
        const I = this.rows.findIndex(e => e.id === id && column in e);
        if (I >= 0) {
            this.rows[I][column] = value;
            return I; 
        } 
        return false;
    }
}

module.exports = {
    DummyDB
}