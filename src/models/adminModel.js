const Admin = require("../schemas/admin");
const proto = require("../prototypes/dao")

try {
    const adm = new Admin();
    proto.setValidationEngine(adm);

} catch (error) {
    
}