import { createClientClient } from './supabaseClient';

export async function uploadFundingProof(file: File): Promise<string> {
    const supabase = createClientClient();

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.');
    }

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        throw new Error('File size exceeds the 5MB limit.');
    }

    // Get current user for folder scoping
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated.');

    // Generate secure path: {userId}/{timestamp}_{random}.{ext}
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload to 'funding-proofs' bucket
    const { data, error } = await supabase.storage
        .from('funding-proofs')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
        });

    if (error) {
        console.error("Storage upload error:", error);
        throw new Error(`Failed to upload proof: ${error.message}`);
    }

    // Return the file path (used to generate signed URLs on demand)
    return data.path;
}
