const testController = (req, res) => {
    res.status(200).send({
        success: true,
        message: 'Hello World!'
    });
}

module.exports = testController;
