import { useEffect, useState } from 'react';



export const useFormErrors = (errors: { [key: string]: string } | undefined) => {
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (errors) {
            setFormErrors(errors);
        } else {
            setFormErrors({});
        }
    }, [errors]);

    return { formErrors, setFormErrors };
};