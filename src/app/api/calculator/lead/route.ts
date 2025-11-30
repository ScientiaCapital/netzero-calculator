import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@netzero/database';
import { z } from 'zod';

// Validation schema for lead submission
const LeadSubmissionSchema = z.object({
  sessionId: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  systemSizeKW: z.number().optional().nullable(),
  annualSavings: z.number().optional().nullable()
});

// Lead submission record type
interface LeadSubmission {
  id?: string;
  tenant_id: string;
  session_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  system_size_kw: number | null;
  annual_savings: number | null;
  status: string;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = LeadSubmissionSchema.parse(body);

    // Create Supabase client
    const supabase = await createServerClient();

    // Prepare the lead submission data
    const leadData: Omit<LeadSubmission, 'id'> = {
      tenant_id: 'calculator',
      session_id: validatedData.sessionId || null,
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || null,
      address: validatedData.address || null,
      system_size_kw: validatedData.systemSizeKW || null,
      annual_savings: validatedData.annualSavings || null,
      status: 'new',
      created_at: new Date().toISOString()
    };

    // Insert lead submission using Supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('lead_submissions')
      .insert(leadData)
      .select('id')
      .single();

    if (error) {
      console.error('Database insert error:', error);
      throw error;
    }

    // Return success response
    return NextResponse.json({
      success: true,
      leadId: data?.id,
      message: 'Lead submitted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Lead submission error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors.map(e => e.message).join(', ')
        },
        { status: 400 }
      );
    }

    // Handle database errors
    return NextResponse.json(
      { error: 'Failed to submit lead. Please try again.' },
      { status: 500 }
    );
  }
}
