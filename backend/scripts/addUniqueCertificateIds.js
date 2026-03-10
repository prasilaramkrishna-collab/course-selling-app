/**
 * Migration Script: Add uniqueCertificateId to existing certificates
 * 
 * This script updates all existing certificates in the database
 * to include a uniqueCertificateId field, which is now required.
 * 
 * Run with: node backend/scripts/addUniqueCertificateIds.js
 */

import mongoose from 'mongoose';
import crypto from 'crypto';
import { Certificate } from '../models/certificate.model.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const addUniqueCertificateIds = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✓ Connected to MongoDB');

        // Find all certificates without uniqueCertificateId
        const certificates = await Certificate.find({
            $or: [
                { uniqueCertificateId: { $exists: false } },
                { uniqueCertificateId: null },
                { uniqueCertificateId: '' }
            ]
        });

        console.log(`Found ${certificates.length} certificate(s) without uniqueCertificateId`);

        if (certificates.length === 0) {
            console.log('All certificates already have uniqueCertificateId. No migration needed.');
            process.exit(0);
        }

        let updated = 0;
        const usedIds = new Set();

        for (const cert of certificates) {
            let uniqueCertificateId;
            
            // Generate a unique ID that hasn't been used yet
            do {
                uniqueCertificateId = `UCN-${Date.now()}-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
            } while (usedIds.has(uniqueCertificateId));
            
            usedIds.add(uniqueCertificateId);

            cert.uniqueCertificateId = uniqueCertificateId;
            await cert.save();
            updated++;

            console.log(`✓ Updated certificate ${cert.certificateNumber} with ID: ${uniqueCertificateId}`);
        }

        console.log(`\n✓ Migration complete! Updated ${updated} certificate(s).`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

// Run the migration
addUniqueCertificateIds();
