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
    let QUESTION_TABLE = table.create([ 'name', 'is_note','date_stored' ]);
    let SUBMIT_TABLE = table.create(['user', 'date']);
    let RESPONSE_TABLE = table.create([ 'submission', 'question', 'value' ]);
    let SESSION_TABLE = table.create(['user', 'start']);
    let ARCHIVED_TABLE = table.create(['name','is_note'])

    // Add Some Initial Data 
    USER_TABLE.addEntry({ name: 'Test User A', email: 'userA@email.com', password: 'passA', role: 'admin' });
    USER_TABLE.addEntry({ name: 'Test User B', email: 'userB@email.com', password: 'passB', role: 'staff' });
    USER_TABLE.addEntry({ name: 'Test User C', email: 'userC@email.com', password: 'passC', role: 'staff' });
    USER_TABLE.addEntry({ name: 'Test User D', email: 'userD@email.com', password: 'passD', role: 'staff' });
    USER_TABLE.addEntry({ name: 'Test User E', email: 'userE@email.com', password: 'passE', role: 'staff' });
    //Dummy Active Questions
    QUESTION_TABLE.addEntry({ id: 1, question: 'How many new Volunteers did you work with this stretch?', is_note: 'false' });
    QUESTION_TABLE.addEntry({ id: 2, question: 'How many new Students did you work with this stretch?', is_note: 'true' });
    QUESTION_TABLE.addEntry({id: 3,  question: 'Question 3', is_note: 'false' });
    QUESTION_TABLE.addEntry({ id: 4, question: 'Question 4', is_note: 'true' });
    QUESTION_TABLE.addEntry({ id: 5, question: 'Question 5', is_note: 'false' });
    QUESTION_TABLE.addEntry({id: 6, question: 'Question 6', is_note: 'false' });
    //Dummy Archived Quesitons
    ARCHIVED_TABLE.addEntry({id: 101, question:'How many students mentioned concerned about Y2k?', is_note: "false",date_stored:"1/01/2000"});
    ARCHIVED_TABLE.addEntry({id: 102, question:'How many students mentioned concern for the 2016 election?', is_note: "false",date_stored:"12/05/2016"});
    ARCHIVED_TABLE.addEntry({id: 103, question:'Did you see the newest episode of Lost?', is_note: "false",date_stored:"5/01/2010"});
    ARCHIVED_TABLE.addEntry({id: 104, question:'Fourth Option?', is_note: "false",date_stored:"1/01/2000"});
    ARCHIVED_TABLE.addEntry({id: 105, question:'Another Option?', is_note: "false",date_stored:"1/01/2000"});
    ARCHIVED_TABLE.addEntry({id: 106, question:'Is this enough?', is_note: "false",date_stored:"1/01/2000"});
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
        Archived: ARCHIVED_TABLE,
        Users: USER_TABLE,
        Questions: QUESTION_TABLE,
        Submissions: SUBMIT_TABLE,
        Responses: RESPONSE_TABLE,
        Sessions: SESSION_TABLE,
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
function Table(columns) {
    this.incrementPos = 0;
    this.columns = [ 'id', ...columns ];
    this.rows = [];

    this.getEntryByID = ( id ) => this.rows.find(e => e.id === id);

    this.addEntry = ( data ) => {
        this.incrementPos++;
        this.rows.push({ id: this.incrementPos, ...data });
    };

    this.removeEntryByID = ( id ) => {
        const I = this.rows.findIndex(e => e.id === id);
        return (I >= 0) ? this.rows.splice(I, 1) : false; 
    }

    this.updateEntry = ({ id, column, value }) => {
        const I = this.rows.findIndex(e => e.id === id && column in e);
        if (I >= 0) {
            this.rows[I][column] = value;
            return I; 
        } 
        return false;
    }

    this.filter = (pred) => this.rows.filter(pred); 
}

module.exports = {
    DummyDB
}