import React, { useEffect, useRef } from 'react'

import { Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadWidget = ({ setImage }) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: cloudName,
            uploadPreset: uploadPreset
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                // console.log("Done! Here is the image info: ", result.info);
                setImage(result.info.secure_url)
            }
        });
    }, [])
    return (
        <Button
            component="upload"
            variant="contained"
            size="medium"
            startIcon={<CloudUploadIcon />}
            onClick={() => widgetRef.current.open()}
            label="Upload"
        >
            <Typography variant="caption">
                Upload file
            </Typography>
        </Button>
    )
}

export default UploadWidget;