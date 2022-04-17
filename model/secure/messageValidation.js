const Yup =require('yup');

exports.schema = Yup.object().shape({
    message:Yup.string()
    .required("پیام الزامی می باشد"),
});