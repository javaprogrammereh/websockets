const Yup = require('yup');

exports.schema = Yup.object().shape({
    connectionId:Yup.string()
    .required("کانکشن الزامی می باشد"),
    nickname:Yup.string()
    .required("نام کاربر الزامی می باشد")
    .min(2)
    .max(20),
    roomNumber: Yup.mixed().oneOf(
        ["room1","room2", "room3"],
        "یکی از 2 وضعیت خصوصی یا عمومی را انتخاب کنید"
    ),
});