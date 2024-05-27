import React, { useEffect, useRef } from 'react';
import { Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface UploadWidgetProps {
    setImage: (url: string) => void;
}

const UploadWidget: React.FC<UploadWidgetProps> = ({ setImage }) => {
    const cloudinaryRef = useRef<any>(null);
    const widgetRef = useRef<any>(null);

    useEffect(() => {
        const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            console.error('Cloudinary cloud name or upload preset is missing!');
            return;
        }

        cloudinaryRef.current = (window as any).cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName,
            uploadPreset
        }, (error: any, result: any) => {
            if (!error && result && result.event === 'success') {
                // console.log("Done! Here is the image info: ", result.info);
                setImage(result.info.secure_url);
            }
        });
    }, [setImage]);

    return (
        <Button
            component="button"
            variant="contained"
            size="medium"
            startIcon={<CloudUploadIcon />}
            onClick={() => widgetRef.current.open()}
        >
            <Typography variant="caption">
                Upload file
            </Typography>
        </Button>
    );
};

export default UploadWidget;