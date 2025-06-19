/** @format */

import axiosClient from './axios';

export const getRequest = async ({ endPoint }) => {
  const res = await axiosClient.get(endPoint);
  return res;
};

export const postRequest = async ({
  endPoint,
  formData,
  isFormData = false,
}: {
  endPoint: string;
  formData: any;
  isFormData?: boolean;
}) => {
  try {
    let options: RequestInit = {
      method: 'POST',
    };

    if (isFormData) {
      options.body = formData;
    } else {
      options.headers = {
        'Content-Type': 'application/json',
      };
      options.body = JSON.stringify(formData);
    }

    const response = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000' + endPoint,
      options
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);

      throw new Error(
        `Failed to create resource: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error in postRequest:', error);
    throw error;
  }
};
export const putRequest = async ({
  endPoint,
  formData,
  isFormData = false,
}: {
  endPoint: string;
  formData: any;
  isFormData?: boolean;
}) => {
  try {
    let options: RequestInit = {
      method: 'PUT',
    };

    if (isFormData) {
      options.body = formData;
    } else {
      options.headers = {
        'Content-Type': 'application/json',
      };
      options.body = JSON.stringify(formData);
    }

    const response = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000' + endPoint,
      options
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);

      throw new Error(
        `Failed to update resource: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error in putRequest:', error);
    throw error;
  }
};
export const deleteRequest = async ({ endPoint }) => {
  const res = await axiosClient.delete(endPoint);
  return res;
};
export const patchRequest = async ({
  endPoint,
  formData,
  isFormData = false,
}: {
  endPoint: string;
  formData: any;
  isFormData?: boolean;
}) => {
  try {
    let options: RequestInit = {
      method: 'PATCH',
    };

    if (isFormData) {
      // For FormData, don't set Content-Type header
      options.body = formData;
    } else {
      options.headers = {
        'Content-Type': 'application/json',
      };
      options.body = JSON.stringify(formData);
    }

    // Make sure we're using the correct base URL with a proper separator
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000';
    const fullUrl = `${baseUrl}${
      endPoint.startsWith('/') ? '' : '/'
    }${endPoint}`;

    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);

      throw new Error(
        `Failed to update resource: ${response.status} ${response.statusText}`
      );
    }

    // Check if response is no-content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error in patchRequest:', error);
    throw error;
  }
};
