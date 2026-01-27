import Axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addAccount } from "@/store/slices/auth.slice";
import { baseUrl } from "@/constants";
import { useNavigate, useSearchParams } from "react-router";

const SocialLogin = () => {
  const [searchParams] = useSearchParams();
  console.log("okkkk");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [platform, setPlatform] = useState<"web" | "mobile">("web");

  useEffect(() => {
    // Detect platform first
    const detectPlatform = () => {
      // Method 1: Check for platform parameter (most reliable)
      const platformParam = searchParams.get("platform");
      if (platformParam === "mobile") {
        return "mobile";
      }

      // Method 2: Check user agent for mobile
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileUA = /android|iphone|ipad|ipod|mobile/i.test(userAgent);
      // Method 3: Check referrer (if coming from in-app browser)
      const referrer = document.referrer;
      const isFromApp =
        referrer.includes("myraapp://") ||
        searchParams.get("source") === "mobile_app";

      return isMobileUA || isFromApp ? "mobile" : "web";
    };

    const detectedPlatform = detectPlatform();
    setPlatform(detectedPlatform);

    console.log("=== SOCIAL LOGIN BRIDGE ===");
    console.log("Platform detected:", detectedPlatform);

    const token = searchParams.get("token");
    console.log("Token received:", token ? "✅ Yes" : "❌ No");

    if (!token) {
      console.error("ERROR: No token in URL");
      setError("Authentication failed. No token received.");
      // Redirect based on platform
      setTimeout(() => {
        if (detectedPlatform === "mobile") {
          // For mobile, redirect to app with error
          window.location.href = `myraapp://callback?error=no_token`;
        } else {
          navigate("/sign-in");
        }
      }, 3000);

      return;
    }

    // Handle based on platform
    if (detectedPlatform === "mobile") {
      handleMobileLogin(token);
    } else {
      handleWebLogin(token);
    }
  }, [searchParams, navigate, dispatch]);

  /**
   * Handle Mobile (Flutter) Login
   * Redirects to deep link immediately
   */
  const handleMobileLogin = (token: string) => {
    try {
      console.log("📱 Mobile platform - Redirecting to app");
      // Create deep link with encoded token
      const deepLink = `myraapp://callback?token=${encodeURIComponent(token)}`;
      console.log("Deep link:", deepLink);
      // Immediate redirect
      window.location.href = deepLink;

      // Fallback message (if deep link fails to open)
      setTimeout(() => {
        setError("If the app doesn't open, please ensure it's installed.");
      }, 2000);
    } catch (err: any) {
      console.error("Mobile redirect error:", err);
      setError("Failed to redirect to app. Please try again.");
      // Fallback: try to redirect to app with error
      setTimeout(() => {
        window.location.href = `myraapp://callback?error=redirect_failed`;
      }, 3000);
    }
  };

  /**
   * Handle Web (React) Login
   * Fetches user data and updates Redux store
   */
  const handleWebLogin = async (token: string) => {
    try {
      console.log("🌐 Web platform - Fetching user data");
      console.log("Making API call to /api/auth/me");

      // Fetch user data with token
      const response = await Axios.get(`${baseUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      console.log("API Response status:", response.status);
      console.log("API Response data:", response.data);

      if (!response.data.status) {
        console.error("ERROR: API returned status false");
        throw new Error("Failed to fetch user data");
      }

      const userData = response.data.data.user;
      console.log("User data received:", userData.email);

      // Dispatch to Redux store
      dispatch(
        addAccount({
          user: userData,
          token: token,
        }),
      );

      console.log("✅ User authenticated, navigating to workspace-setup");

      // Navigate to workspace setup
      navigate("/workspace-setup");
    } catch (err: any) {
      console.error("=== WEB LOGIN ERROR ===");
      console.error("Error:", err);
      console.error("Response:", err.response?.data);
      console.error("Status:", err.response?.status);

      const errorMessage =
        err.response?.data?.message || err.message || "Unknown error occurred";

      setError(`Authentication failed: ${errorMessage}`);
      setTimeout(() => {
        navigate("/sign-in");
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4 p-6">
        {!error ? (
          <>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <h2 className="text-xl font-semibold">
              {platform === "mobile"
                ? "Redirecting to app..."
                : "Authenticating..."}
            </h2>
            <p className="text-muted-foreground">
              {platform === "mobile"
                ? "Opening the app, please wait..."
                : "Please wait while we log you in"}
            </p>
          </>
        ) : (
          <>
            <div className="text-destructive text-4xl">⚠️</div>
            <h2 className="text-xl font-semibold text-destructive">
              Authentication Failed
            </h2>
            <p className="text-muted-foreground max-w-md">{error}</p>
            <p className="text-sm text-muted-foreground">
              {platform === "mobile"
                ? "Please try again from the app..."
                : "Redirecting to login page..."}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialLogin;
